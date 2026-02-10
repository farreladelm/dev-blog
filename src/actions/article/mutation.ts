"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { STATUS } from "@/constants/article";
import { ActionResult, ActionState, ArticleDraft } from "@/lib/types";
import { cookies, headers } from "next/headers";
import { Article, Prisma } from "@/app/generated/prisma/client";
import { redis } from "@/lib/redis";

const tagSchema = z
  .string()
  .min(1, "Tag cannot be empty")
  .max(30, "Tag is too long")
  .regex(/^\S+$/, "Tag must not contain spaces");

const articleSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title is too long"),
  body: z.string().min(1, "Body cannot be empty"),
  tags: z.array(tagSchema).optional(),
  status: z.enum([STATUS.DRAFT, STATUS.PUBLISHED]).optional(),
});

type CreateArticleActionState = ActionState<
  "title" | "body" | "tags" | "status",
  { article: Article; authorUsername: string }
>;

export async function submitArticleForm(
  draft: ArticleDraft,
  _: CreateArticleActionState | undefined,
  formData: FormData,
): Promise<CreateArticleActionState> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthenticated" };
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
        success: false,
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

    const createdArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        body: data.body,
        authorId: session.userId,
        status: data.status ?? STATUS.DRAFT,
        publishedAt,
        tags: {
          create:
            data.tags?.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            })) ?? [],
        },
      },
    });

    revalidatePath("/articles");
    revalidatePath(`/${session.username}/articles`);

    return {
      success: true,
      data: { article: createdArticle, authorUsername: session.username },
    };
  } catch (error) {
    console.error("Error on creating new article:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed on creating new article" };
  }
}

export async function submitArticleUpdateForm(
  articleId: string,
  draft: ArticleDraft,
  _: CreateArticleActionState | undefined,
  formData: FormData,
): Promise<CreateArticleActionState> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Authorization: Check if the article exists and belongs to the user
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return { success: false, error: "Article not found" };
    }

    if (existingArticle.authorId !== session.userId) {
      return {
        success: false,
        error: "You don't have permission to edit this article",
      };
    }

    const parsedData = articleSchema.safeParse({
      title: draft.title,
      body: draft.body,
      tags: draft.tags,
      status: formData.get("status") as string,
    });

    if (!parsedData.success) {
      const fieldErrors = z.flattenError(parsedData.error).fieldErrors;

      return {
        success: false,
        fieldErrors: {
          title: fieldErrors.title?.[0],
          body: fieldErrors.body?.[0],
          tags: fieldErrors.tags?.[0],
          status: fieldErrors.status?.[0],
        },
      };
    }

    const data = parsedData.data;

    // Only generate new slug if title changed
    const slug =
      data.title !== existingArticle.title
        ? await generateUniqueSlug(data.title)
        : existingArticle.slug;

    const isPublished = data.status === STATUS.PUBLISHED;
    const wasPublished = existingArticle.status === STATUS.PUBLISHED;

    // Set publishedAt only if transitioning from draft to published
    const publishedAt =
      isPublished && !wasPublished ? new Date() : existingArticle.publishedAt;

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: data.title,
        slug,
        body: data.body,
        status: data.status ?? STATUS.DRAFT,
        publishedAt,
        tags: {
          deleteMany: {}, // Remove all existing tags
          create:
            data.tags?.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            })) ?? [],
        },
      },
    });

    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);

    return {
      success: true,
      data: { article: updatedArticle, authorUsername: session.username },
    };
  } catch (error) {
    console.error("Error on updating article:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed on updating article" };
  }
}

export async function deleteArticle(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthenticated" };
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article || article.authorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    console.log(article);

    await prisma.article.delete({ where: { id } });

    revalidatePath("/articles");
    revalidatePath(`/${session.username}/articles`);

    return {
      success: true,
      data: {
        message: "Successfully delete article",
      },
    };
  } catch (error) {
    console.error("Error deleting article:", error);
    return {
      success: false,
      error: "Failed to delete article",
    };
  }
}

export async function likeArticle(
  articleId: string,
): Promise<ActionResult<{ likes: number }>> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "You must be logged in to like articles" };
  }

  try {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        likes: { increment: 1 },
        likedBy: {
          create: {
            userId: session.userId,
          },
        },
      },
    });

    revalidatePath(`/articles/${article.slug}`);

    return {
      success: true,
      data: {
        likes: article.likes,
      },
    };
  } catch (error) {
    console.error("Error liking article:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, error: "Already liked" };
    }
    return { success: false, error: "Failed to like article" };
  }
}

export async function unlikeArticle(
  articleId: string,
): Promise<ActionResult<{ likes: number }>> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    // Delete like and decrement count in a transaction
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        likes: { decrement: 1 },
        likedBy: {
          delete: {
            userId_articleId: {
              userId: session.userId,
              articleId,
            },
          },
        },
      },
    });

    revalidatePath(`/articles/${article.slug}`);

    return {
      success: true,
      data: {
        likes: article.likes,
      },
    };
  } catch (error) {
    console.error("Error unliking article:", error);
    return { success: false, error: "Failed to unlike article" };
  }
}

export async function toggleArticleStatus(slug: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthenticated" };
    }

    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article || article.authorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const newStatus =
      article.status === STATUS.PUBLISHED ? STATUS.DRAFT : STATUS.PUBLISHED;

    const statusMessage =
      newStatus === STATUS.PUBLISHED ? "publish" : "unpublish";

    const publishedAt = newStatus === STATUS.PUBLISHED ? new Date() : null;

    await prisma.article.update({
      where: { id: article.id },
      data: { status: newStatus, publishedAt },
    });

    revalidatePath(`/articles/${slug}`);
    revalidatePath("/");
    revalidatePath("/my-articles");
    revalidatePath(`/${session.username}`);
    return {
      success: true,
      data: { message: `Successfully ${statusMessage} article` },
    };
  } catch (error) {
    console.error("Error on toggling article status:", error);
    return { success: false, error: "Cannot change article status" };
  }
}

async function getFingerprint(articleId: string): Promise<string> {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "unknown";
  const userAgent = headerStore.get("user-agent") ?? "";

  const raw = `${ip}-${userAgent}-${articleId}`;
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function incrementView(
  articleId: string,
): Promise<ActionResult<{ views: number }>> {
  const fingerprint = await getFingerprint(articleId);
  const key = `view:${fingerprint}`;

  const alreadyViewed = await redis.get(key);
  if (alreadyViewed) return { success: false, error: "Already counted" };

  try {
    await redis.setex(key, 60 * 60 * 24, "1"); // expires in 24 hours

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
    });

    revalidatePath(`/articles/${article.slug}`);
    return { success: true, data: { views: article.views } };
  } catch (error) {
    console.error("Error updating view count:", error);
    return { success: false, error: "Failed to update view count" };
  }
}
