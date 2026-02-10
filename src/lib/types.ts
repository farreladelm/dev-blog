import { Prisma, User } from "@/app/generated/prisma/client";

export type ActionResult<TData = never> =
  | (TData extends never ? { success: true } : { success: true; data: TData })
  | {
      success: false;
      error: string;
    };

export type ActionState<TFields extends string, TData = never> =
  | (TData extends never ? { success: true } : { success: true; data: TData })
  | {
      success: false;
      fieldErrors?: Partial<Record<TFields, string>>;
      error?: string;
      submittedData?: Record<string, any>;
    }
  | undefined;

export type RegisterActionState = ActionState<
  "email" | "username" | "password"
>;

export type LoginActionState = ActionState<"email" | "password">;

export type ArticleDraft = {
  title: string;
  body: string;
  tags: string[];
};

export type ArticleWithUserAndTag = Prisma.ArticleGetPayload<{
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

export type ArticlesPaginated = {
  articles: ArticleWithUserAndTag[];
  hasMore: boolean;
};

export type UserProfile = Pick<
  User,
  "id" | "name" | "username" | "avatarImage" | "bio"
>;

export type SessionUser = {
  username: string;
  name: string;
  avatarImage: string | null;
};
