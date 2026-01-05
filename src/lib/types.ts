import { prisma } from "@/lib/prisma";

export type Article = typeof prisma.article;

export type ActionState<TFields extends string> =
  | {
      fieldErrors?: Partial<Record<TFields, string>>;
      error?: string;
    }
  | undefined;

export type RegisterActionState = ActionState<
  "email" | "username" | "password"
>;

export type LoginActionState = ActionState<"email" | "password">;
