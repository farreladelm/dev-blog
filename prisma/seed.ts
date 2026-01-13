import { ArticleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { articlesData } from "./articles.data";
import { calculateReadingTime } from "../src/lib/calculateReadingTime";
import { generateUniqueSlug } from "../src/lib/slug";
import { hashPassword } from "@/lib/auth";

async function main() {
  // ---------------------------------------
  // USER
  // ---------------------------------------
  const passwordHash = await hashPassword("securepassword123");

  const user = await prisma.user.upsert({
    where: { username: "devblog" },
    update: {},
    create: {
      email: "devblog@example.com",
      username: "devblog",
      name: "Dev Blog",
      password: passwordHash,
      bio: "Writing about software engineering, web, and ideas.",
    },
  });

  // ---------------------------------------
  // TAGS
  // ---------------------------------------
  const tagNames = [
    "nextjs",
    "prisma",
    "postgres",
    "typescript",
    "markdown",
    "server-actions",
    "database",
    "schema",
    "prisma",
    "auth",
    "security",
    "writing",
    "career",
    "performance",
    "ux",
    "blog",
    "production",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t]));

  // ---------------------------------------
  // ARTICLES
  // ---------------------------------------
  for (const article of articlesData) {
    const slug = await generateUniqueSlug(article.title);
    const readingTime = calculateReadingTime(article.body);

    await prisma.article.create({
      data: {
        title: article.title,
        slug,
        body: article.body.trim(),
        readingTime,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: user.id,
        tags: {
          create: article.tags.map((tagName) => ({
            tag: {
              connect: { name: tagName },
            },
          })),
        },
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
