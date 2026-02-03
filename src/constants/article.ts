import { ArticleStatus } from "@/app/generated/prisma/client";

export const DRAFT_KEY = "new-article-draft";
export const MAX_ARTICLE_TAGS = 3;
export const DEBOUNCE_DELAY = 500;

type ArticleStatusEnumObject = {
  DRAFT: ArticleStatus;
  PUBLISHED: ArticleStatus;
};

export const STATUS: ArticleStatusEnumObject = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
};
