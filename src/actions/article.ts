"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  tags: z.string().optional(),
});

export async function createArticleAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const data = articleSchema.parse({
      title: formData.get("title"),
      body: formData.get("body"),
      tags: formData.get("tags"),
    });

    const slug = await generateUniqueSlug(data.title);
    const tagNames =
      data.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        body: data.body,
        authorId: session.userId,
        tags: {
          create: await Promise.all(
            tagNames.map(async (name) => {
              const tag = await prisma.tag.upsert({
                where: { name },
                create: { name },
                update: {},
              });
              return { tagId: tag.id };
            })
          ),
        },
      },
    });

    revalidatePath("/");
    redirect(`/articles/${article.slug}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function updateArticleAction(slug: string, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.authorId !== session.userId) {
    return { error: "Forbidden" };
  }

  try {
    const data = articleSchema.parse({
      title: formData.get("title"),
      body: formData.get("body"),
      tags: formData.get("tags"),
    });

    const tagNames =
      data.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    await prisma.articleTag.deleteMany({ where: { articleId: article.id } });

    await prisma.article.update({
      where: { id: article.id },
      data: {
        title: data.title,
        body: data.body,
        tags: {
          create: await Promise.all(
            tagNames.map(async (name) => {
              const tag = await prisma.tag.upsert({
                where: { name },
                create: { name },
                update: {},
              });
              return { tagId: tag.id };
            })
          ),
        },
      },
    });

    revalidatePath(`/articles/${slug}`);
    revalidatePath("/");
    redirect(`/articles/${slug}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function deleteArticleAction(slug: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.authorId !== session.userId) {
    return { error: "Forbidden" };
  }

  await prisma.article.delete({ where: { id: article.id } });

  revalidatePath("/");
  redirect("/articles");
}

export async function togglePublishAction(slug: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.authorId !== session.userId) {
    return { error: "Forbidden" };
  }

  const newStatus = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  await prisma.article.update({
    where: { id: article.id },
    data: { status: newStatus },
  });

  revalidatePath(`/articles/${slug}`);
  revalidatePath("/");
  return { success: true };
}
