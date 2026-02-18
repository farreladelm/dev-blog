import { z } from "zod";
import { STATUS } from "@/constants/article";

export const authorSelect = {
  username: true,
  name: true,
  avatarImage: true,
};

// Include shape optimized for listing: returns tag names nested under `tag`
export const articleIncludeWithTagName = {
  author: { select: authorSelect },
  tags: { select: { tag: { select: { name: true } } } },
};

export function paginate(page = 1, limit = 8) {
  const skip = (page - 1) * limit;
  return { skip, take: limit + 1 };
}

export function processListResults<T = any>(items: T[], limit: number) {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  return { data, hasMore };
}

export const tagSchema = z
  .string()
  .min(1, "Tag cannot be empty")
  .max(30, "Tag is too long")
  .regex(/^[a-z0-9]+$/i, "Tag must contain only letters and numbers");

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title is too long"),
  body: z.string().min(1, "Body cannot be empty"),
  tags: z.array(tagSchema).optional(),
  status: z.enum([STATUS.DRAFT, STATUS.PUBLISHED]).optional(),
});

export function formatZodFieldErrors(err: z.ZodError) {
  const fieldErrors: Record<string, string[]> = z.flattenError(err).fieldErrors;
  return {
    title: fieldErrors.title?.[0],
    body: fieldErrors.body?.[0],
    tags: fieldErrors.tags?.[0],
    status: fieldErrors.status?.[0],
  } as {
    title?: string;
    body?: string;
    tags?: string;
    status?: string;
  };
}

export async function getFingerprint(articleId: string): Promise<string> {
  const headerStore = await (await import("next/headers")).headers();
  const ip = headerStore.get("x-forwarded-for") ?? "unknown";
  const userAgent = headerStore.get("user-agent") ?? "";

  const raw = `${ip}-${userAgent}-${articleId}`;
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
