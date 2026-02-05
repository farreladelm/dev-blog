"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, createToken, setAuthCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResult, ActionState } from "@/lib/types";
import { User } from "@/app/generated/prisma/client";
import { uploadAvatar, deleteAvatar } from "@/lib/upload-utils";

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email("Invalid email address"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be at most 200 characters")
    .optional(),
  websiteUrl: z.url("Invalid URL").optional().or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(100, "Location must be at most 100 characters")
    .optional(),
  jobTitle: z
    .string()
    .trim()
    .max(100, "Job title must be at most 100 characters")
    .optional(),
  education: z
    .string()
    .trim()
    .max(100, "Education must be at most 100 characters")
    .optional(),
  skillsOrLanguages: z
    .string()
    .trim()
    .max(200, "Skills or languages must be at most 200 characters")
    .optional(),
  availableFor: z
    .string()
    .trim()
    .max(200, "Available for must be at most 200 characters")
    .optional(),
});

export type UpdateProfileActionState = ActionState<
  | "name"
  | "email"
  | "username"
  | "avatarImage"
  | "websiteUrl"
  | "location"
  | "bio"
  | "jobTitle"
  | "education"
  | "skillsOrLanguages"
  | "availableFor",
  { message: string }
>;

export async function updateProfile(
  username: string,
  _: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  const session = await getSession();

  if (!session || session.username !== username) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      username: formData.get("username"),
      bio: formData.get("bio") || undefined,
      websiteUrl: formData.get("websiteUrl") || undefined,
      location: formData.get("location") || undefined,
      jobTitle: formData.get("jobTitle") || undefined,
      education: formData.get("education") || undefined,
      skillsOrLanguages: formData.get("skillsOrLanguages") || undefined,
      availableFor: formData.get("availableFor") || undefined,
    };

    const parsed = updateProfileSchema.safeParse(rawData);

    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(
        Object.entries(z.flattenError(parsed.error).fieldErrors).map(
          ([key, value]) => [key, value?.[0]],
        ),
      );

      return {
        success: false,
        error: "Failed updating profile due to validation errors",
        fieldErrors,
        submittedData: rawData,
      };
    }

    const {
      name,
      email,
      username: newUsername,
      bio,
      websiteUrl,
      location,
      jobTitle,
      education,
      skillsOrLanguages,
      availableFor,
    } = parsed.data;

    // Handle avatar image upload
    let avatarImagePath: string | null = null;
    const avatarFile = formData.get("avatarImage") as File | null;

    if (avatarFile && avatarFile.size > 0) {
      const uploadResult = await uploadAvatar(avatarFile, session.userId);

      if (!uploadResult.success) {
        return {
          success: false,
          fieldErrors: {
            avatarImage: uploadResult.error,
          },
        };
      }

      avatarImagePath = uploadResult.path;

      // Delete old avatar if exists
      const currentUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { avatarImage: true },
      });

      if (currentUser?.avatarImage) {
        await deleteAvatar(currentUser.avatarImage);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        email,
        username: newUsername,
        bio: bio && bio.length > 0 ? bio : null,
        websiteUrl: websiteUrl && websiteUrl.length > 0 ? websiteUrl : null,
        location: location && location.length > 0 ? location : null,
        jobTitle: jobTitle && jobTitle.length > 0 ? jobTitle : null,
        education: education && education.length > 0 ? education : null,
        skillsOrLanguages:
          skillsOrLanguages && skillsOrLanguages.length > 0
            ? skillsOrLanguages
            : null,
        availableFor:
          availableFor && availableFor.length > 0 ? availableFor : null,
        ...(avatarImagePath && { avatarImage: avatarImagePath }),
      },
    });

    if (
      updatedUser.name !== session.name ||
      updatedUser.username !== session.username ||
      updatedUser.avatarImage !== session.avatarImage
    ) {
      const token = await createToken(updatedUser);
      await setAuthCookie(token);
    }

    revalidatePath(`/${newUsername}`);
    revalidatePath("/profile/edit");

    return {
      success: true,
      data: { message: "Successfully updated profile" },
    };
  } catch (error) {
    console.error("Error when updating profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your profile",
    };
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
