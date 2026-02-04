"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, createToken, setAuthCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResult, ActionState } from "@/lib/types";
import { User } from "@/app/generated/prisma/client";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.email(),
  bio: z.string().trim().max(160).optional(),
});

export type UpdateProfileActionState = ActionState<
  "name" | "email" | "bio",
  { message: string }
>;

export async function updateProfileAction(
  username: string,
  _: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  const session = await getSession();

  if (!session || session.username !== username) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parsed = updateProfileSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      bio: formData.get("bio") || "",
    });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      return {
        success: false,
        fieldErrors: {
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
          bio: fieldErrors.bio?.[0],
        },
      };
    }

    const { name, email, bio } = parsed.data;

    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.userId },
      },
      select: { id: true },
    });

    if (existingEmail) {
      return {
        success: false,
        fieldErrors: { email: "Email is already in use" },
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        email,
        bio: bio && bio.length > 0 ? bio : null,
      },
    });

    if (updatedUser.name !== session.name) {
      const token = await createToken(updatedUser);
      await setAuthCookie(token);
    }

    revalidatePath(`/${username}`);

    return { success: true, data: { message: "Successfully update profile" } };
  } catch (error) {
    console.error("Error when updating profile:", error);
    return { success: false, error: error as string };
  }
}

export async function getUserDetail(
  username: string,
): Promise<ActionResult<User>> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting user detail:", error);
    return { success: false, error: "Error getting user detail" };
  }
}
