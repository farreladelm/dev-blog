"use server";

import { prisma } from "@/lib/prisma";

export async function searchTags(query: string) {
  if (!query.trim()) return [];

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

  return tags.map((t) => t.name);
}
