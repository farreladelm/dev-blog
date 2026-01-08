"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { STATUS } from "@/constants/article";
import {
  ActionResult,
  ArticleDraft,
  CreateArticleActionState,
  PublishedArticle,
} from "@/lib/types";
import { ArticleStatus } from "@/app/generated/prisma/enums";

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  status: z.enum([STATUS.DRAFT, STATUS.PUBLISHED]).optional(),
});

export async function createArticleAction(
  draft: ArticleDraft,
  _: CreateArticleActionState | undefined,
  formData: FormData
): Promise<CreateArticleActionState> {
  const session = await getSession();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const parsedData = articleSchema.safeParse({
      title: draft.title,
      body: draft.body,
      tags: draft.tags,
      status: formData.get("status") as string,
    });

    if (!parsedData.success) {
      const fieldErrors = z.flattenError(parsedData.error).fieldErrors;

      return {
        fieldErrors: {
          title: fieldErrors.title?.[0],
          body: fieldErrors.body?.[0],
          tags: fieldErrors.tags?.[0],
          status: fieldErrors.status?.[0],
        },
      };
    }

    const data = parsedData.data;

    const slug = await generateUniqueSlug(data.title);

    const isPublished = data.status === STATUS.PUBLISHED;
    const publishedAt = isPublished ? new Date() : null;

    await prisma.$transaction(async (tx) => {
      const createdArticle = await tx.article.create({
        data: {
          title: data.title,
          slug,
          body: data.body,
          authorId: session.userId,
          status: (data.status ?? STATUS.DRAFT) as ArticleStatus,
          publishedAt,
        },
      });

      if (data.tags && data.tags.length > 0) {
        for (const name of data.tags) {
          const tag = await tx.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          });

          await tx.articleTag.create({
            data: {
              articleId: createdArticle.id,
              tagId: tag.id,
            },
          });
        }
      }

      return createdArticle;
    });

    revalidatePath("/");

    return {
      success: true,
    };
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

export async function getAllPublishedArticlesAction(): Promise<
  ActionResult<PublishedArticle[]>
> {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { data: articles };
  } catch (error) {
    return { error: "Failed to fetch articles" };
  }
}
