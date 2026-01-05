import slugify from "slugify";
import { prisma } from "./prisma";

export async function generateUniqueSlug(title: string): Promise<string> {
  let slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let counter = 1;
  let uniqueSlug = slug;

  while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
