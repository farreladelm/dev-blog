import { Prisma } from "@/app/generated/prisma/client";

export type ActionResult<T> = {
  data?: T;
  error?: string;
};

export type ActionState<TFields extends string> =
  | {
      success?: boolean;
      fieldErrors?: Partial<Record<TFields, string>>;
      error?: string;
    }
  | undefined;

export type RegisterActionState = ActionState<
  "email" | "username" | "password"
>;

export type LoginActionState = ActionState<"email" | "password">;
export type CreateArticleActionState = ActionState<
  "title" | "body" | "tags" | "status"
>;

export type ArticleDraft = {
  title: string;
  body: string;
  tags: string[];
};

export type PublishedArticle = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        username: true;
        name: true;
        avatarImage: true;
      };
    };
    tags: {
      select: {
        tag: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

export type PublishedArticlesPaginated = {
  articles: PublishedArticle[];
  hasMore: boolean;
};
