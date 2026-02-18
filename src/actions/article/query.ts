"use server";

import { STATUS } from "@/constants/article";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, ArticleWithUserAndTag } from "@/lib/types";
import {
  articleIncludeWithTagName,
  paginate,
  processListResults,
} from "./helpers";

export async function getPublishedArticles(
  page: number = 1,
  limit: number = 8,
): Promise<
  ActionResult<{ articles: ArticleWithUserAndTag[]; hasMore: boolean }>
> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { skip, take } = paginate(page, limit);

    const articles = await prisma.article.findMany({
      where: { status: STATUS.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
      include: articleIncludeWithTagName,
    });

    const { data: articlesData, hasMore } = processListResults(articles, limit);

    return { success: true, data: { articles: articlesData, hasMore } };
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
        ...articleIncludeWithTagName,
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
        ...articleIncludeWithTagName,
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
        ...articleIncludeWithTagName,
      },
      orderBy: [{ createdAt: "desc" }, { publishedAt: "desc" }],
    });

    return { success: true, data: articles };
  } catch (error) {
    console.error("Error getting user articles:", error);
    return { success: false, error: "Failed to get user articles" };
  }
}

export async function searchArticles(
  query: string,
  page: number = 1,
  limit: number = 8,
): Promise<
  ActionResult<{ articles: ArticleWithUserAndTag[]; hasMore: boolean }>
> {
  try {
    const { skip, take } = paginate(page, limit);

    const articles = await prisma.article.findMany({
      where: {
        status: STATUS.PUBLISHED,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { body: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
      include: articleIncludeWithTagName,
    });

    const { data: articlesData, hasMore } = processListResults(articles, limit);

    return { success: true, data: { articles: articlesData, hasMore } };
  } catch (error) {
    return {
      success: false,
      error: "Failed to search articles",
    };
  }
}

export async function getPublishedArticlesOfTag(
  page: number = 1,
  limit: number = 8,
  tag: string,
): Promise<
  ActionResult<{
    articles: ArticleWithUserAndTag[];
    hasMore: boolean;
    count: number;
  }>
> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { skip, take } = paginate(page, limit);

    const where = {
      status: STATUS.PUBLISHED,
      tags: { some: { tag: { name: tag } } },
    };

    const [articles, count] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take,
        include: articleIncludeWithTagName,
      }),
      prisma.article.count({ where }),
    ]);

    const { data: articlesData, hasMore } = processListResults(articles, limit);

    return { success: true, data: { articles: articlesData, hasMore, count } };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch articles of tag "${tag}"`,
    };
  }
}
