import { prisma } from "@/lib/prisma";

export type Article = typeof prisma.article;

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
