"use server";

import { STATUS } from "@/constants/article";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, ArticleWithUserAndTag } from "@/lib/types";

export async function getPublishedArticles(
  page: number = 1,
  limit: number = 8,
): Promise<
  ActionResult<{ articles: ArticleWithUserAndTag[]; hasMore: boolean }>
> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const skip = (page - 1) * limit;

    const articles = await prisma.article.findMany({
      where: { status: STATUS.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit + 1,
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
    const session = await getSession();
    const userId = session?.userId;

    const article = await prisma.article.findUnique({
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
    console.error("Error on finding article by slug:", error);
    return { success: false, error: "Cannot find article" };
  }
}

export async function getArticleForEditing(slug: string): Promise<
  ActionResult<{
    article: ArticleWithUserAndTag;
  }>
> {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "Unauthenticated" };
    }

    const article = await prisma.article.findUnique({
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
      },
    });

    if (!article) return { success: false, error: "Article not found" };

    if (article.authorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    return { success: true, data: { article } };
  } catch (error) {
    console.error("Error on finding article by slug:", error);
    return { success: false, error: "Cannot find article" };
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
      orderBy: [{ createdAt: "desc" }, { publishedAt: "desc" }],
    });

    return { success: true, data: articles };
  } catch (error) {
    console.error("Error getting user articles:", error);
    return { success: false, error: "Failed to get user articles" };
  }
}
