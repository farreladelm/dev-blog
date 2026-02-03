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
  ActionState,
  ArticleDraft,
  ArticleWithUserAndTag,
} from "@/lib/types";
import { cookies } from "next/headers";
import { Article } from "@/app/generated/prisma/client";

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

export async function createArticle(
  draft: ArticleDraft,
  _: CreateArticleActionState | undefined,
  formData: FormData,
): Promise<CreateArticleActionState> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
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
    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }
    throw error;
  }
}

export async function updateArticle(
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

    await prisma.article.update({
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

    redirect(`/articles/${slug}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }
    throw error;
  }
}

export async function toggleArticlePublicity(slug: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.authorId !== session.userId) {
    return { error: "Forbidden" };
  }

  const newStatus =
    article.status === STATUS.PUBLISHED ? STATUS.DRAFT : STATUS.PUBLISHED;

  await prisma.article.update({
    where: { id: article.id },
    data: { status: newStatus },
  });

  revalidatePath(`/articles/${slug}`);
  revalidatePath("/articles");
  return { success: true };
}

export async function getPublishedArticlesPaginated(
  page: number = 1,
  limit: number = 8,
): Promise<ActionResult<{ articles: Article[]; hasMore: boolean }>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const skip = (page - 1) * limit;

    const articles = await prisma.article.findMany({
      where: { status: STATUS.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit + 1, // Fetch one extra
      include: {
        author: {
          select: {
            username: true,
            name: true,
            avatarImage: true,
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

    const hasMore = articles.length > limit;
    const articlesData = hasMore ? articles.slice(0, limit) : articles;

    return {
      success: true,
      data: {
        articles: articlesData,
        hasMore,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch articles",
    };
  }
}

export async function getArticleBySlug(slug: string): Promise<
  ActionResult<{
    article: ArticleWithUserAndTag;
    isLikedByCurrentUser: boolean;
  }>
> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const session = await getSession();
    const userId = session?.userId;

    const article = await prisma.article.findUniqueOrThrow({
      where: { slug },
      include: {
        author: {
          select: {
            username: true,
            name: true,
            avatarImage: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likedBy: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!article) return { success: false, error: "Article not found" };

    const isLikedByCurrentUser =
      userId && article.likedBy ? article.likedBy.length > 0 : false;

    return { success: true, data: { article, isLikedByCurrentUser } };
  } catch (error) {
    return { success: false, error: "Failed to fetch article" };
  }
}

// Used spesifically for update page
// only for author
export async function getAuthorArticle(slug: string): Promise<
  ActionResult<{
    article: ArticleWithUserAndTag;
  }>
> {
  try {
    const session = await getSession();

    if (!session) return { success: false, error: "Unauthenticated" };

    const article = await prisma.article.findUniqueOrThrow({
      where: { slug, authorId: session.userId },
      include: {
        author: {
          select: {
            username: true,
            name: true,
            avatarImage: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log(article);

    if (!article) return { success: false, error: "Article not found" };

    return { success: true, data: { article } };
  } catch (error) {
    return { success: false, error: "Failed to fetch article" };
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
    // Check if already liked
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId: session.userId,
          articleId,
        },
      },
    });

    if (existingLike) {
      return { success: false, error: "Already liked" };
    }

    // Create like and increment count in a transaction
    const [_, article] = await prisma.$transaction([
      prisma.articleLike.create({
        data: {
          userId: session.userId,
          articleId,
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { likes: { increment: 1 } },
      }),
    ]);

    revalidatePath(`/articles/${article.slug}`);

    return {
      success: true,
      data: {
        likes: article.likes,
      },
    };
  } catch (error) {
    console.error("Error liking article:", error);
    return { success: false, error: "Failed to like article" };
  }
}

export async function unlikeArticle(
  articleId: string,
): Promise<ActionResult<{ likes: number }>> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!session?.userId) {
    return { success: false, error: "You must be logged in" };
  }

  try {
    // Delete like and decrement count in a transaction
    const [_, article] = await prisma.$transaction([
      prisma.articleLike.delete({
        where: {
          userId_articleId: {
            userId: session.userId,
            articleId,
          },
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { likes: { decrement: 1 } },
      }),
    ]);

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

export async function getArticlesByAuthor(username: string) {
  const session = await getSession();

  let status = undefined;
  if (!session || session.username !== username) {
    status = STATUS.PUBLISHED;
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        author: { username },
        ...(status && { status }),
      },
      orderBy: [{ createdAt: "desc" }, { publishedAt: "desc" }],
    });

    return { success: true, data: articles };
  } catch (error) {
    console.error("Error getting user articles:", error);
    return { success: false, error: "Failed to get user articles" };
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

export async function publishArticle(id: string) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "Unauthenticated" };
    }

    const currentDate = new Date();
    const _ = await prisma.article.update({
      where: { id, authorId: session.userId },
      data: {
        status: STATUS.PUBLISHED,
        updatedAt: currentDate,
        publishedAt: currentDate,
      },
    });

    revalidatePath(`/${session.username}/articles`);

    return { success: true, data: { message: "Successfully publish article" } };
  } catch (error) {
    console.error("Error publishing article:", error);
    return { success: false, error: "Failed to publish an article" };
  }
}

export async function unpublishArticle(id: string) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "Unauthenticated" };
    }

    const currentDate = new Date();
    const _ = await prisma.article.update({
      where: { id, authorId: session.userId },
      data: {
        status: STATUS.DRAFT,
        updatedAt: currentDate,
        publishedAt: null,
      },
    });

    revalidatePath(`/${session.username}/articles`);

    return {
      success: true,
      data: { message: "Successfully unpublish article" },
    };
  } catch (error) {
    console.error("Error unpublishing article:", error);
    return { success: false, error: "Failed to unpublish an article" };
  }
}

export async function incrementView(id: string) {
  const cookieStore = await cookies();
  const cookieName = `article_${id}_viewed`;
  const hasViewed = cookieStore.get(cookieName);

  if (hasViewed) {
    return { success: true, data: { message: "Already Counted" } };
  }

  try {
    const article = await prisma.article.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    return { success: true, data: { views: article.views } };
  } catch (error) {
    console.error("Error updating view count:", error);
    return { success: false, error: "Failed to update view count" };
  }
}
