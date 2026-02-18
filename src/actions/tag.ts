"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/lib/types";

export async function searchTags(
  query: string,
): Promise<ActionResult<{ tags: string[] }>> {
  try {
    if (!query.trim()) return { success: true, data: { tags: [] } };

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        posts: {
          _count: "desc", // popular tags first
        },
      },
      take: 10,
    });

    return { success: true, data: { tags: tags.map((t) => t.name) } };
  } catch (error) {
    console.error("Error searching tags:", error);
    return { success: false, error: "Failed to search tags" };
  }
}

export async function getPopularTags(
  limit = 10,
): Promise<ActionResult<{ tags: string[] }>> {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: limit,
      select: {
        name: true,
      },
    });

    return { success: true, data: { tags: tags.map((t) => t.name) } };
  } catch (error) {
    console.error("Error getting popular tags:", error);
    return { success: false, error: "Failed to get popular tags" };
  }
}
