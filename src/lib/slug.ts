import slugify from "slugify";
import { prisma } from "./prisma";

export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const existingSlugs = await prisma.article.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: { slug: true },
  });

  if (existingSlugs.length === 0) {
    return baseSlug;
  }

  const usedNumbers = existingSlugs
    .map(({ slug }) => {
      const match = slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
      return match ? Number(match[1]) : null;
    })
    .filter((n): n is number => n !== null);

  const nextNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;

  return `${baseSlug}-${nextNumber}`;
}
