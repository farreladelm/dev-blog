// lib/upload-utils.ts (or utils/file-upload.ts)
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { z } from "zod";

// Avatar validation schema
export const avatarImageSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Image is required")
  .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      ),
    "Only .jpg, .jpeg, .png and .webp formats are supported",
  );

export type UploadAvatarResult =
  | { success: true; path: string }
  | { success: false; error: string };

/**
 * Uploads an avatar image to the public/avatars directory
 * @param file - The file to upload
 * @param userId - The user ID to use in the filename
 * @returns The relative path to the uploaded file or an error
 */
export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<UploadAvatarResult> {
  // Validate file
  const validation = avatarImageSchema.safeParse(file);

  if (!validation.success) {
    const errors = validation.error.flatten().formErrors;
    return { success: false, error: errors[0] || "Invalid file" };
  }

  try {
    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${userId}-${timestamp}.${fileExtension}`;

    // Define upload directory
    const uploadDir = join(process.cwd(), "public", "avatars");

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return relative path for database
    return { success: true, path: `/avatars/${fileName}` };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

/**
 * Deletes an avatar file from the public directory
 * @param avatarPath - The relative path to the avatar (e.g., /avatars/user-123.jpg)
 */
export async function deleteAvatar(avatarPath: string): Promise<void> {
  if (!avatarPath) return;

  try {
    const filePath = join(process.cwd(), "public", avatarPath);
    await unlink(filePath);
  } catch (error) {
    // Ignore if file doesn't exist
    console.log("Avatar file not found or couldn't be deleted:", avatarPath);
  }
}

/**
 * Validates an avatar file without uploading
 * @param file - The file to validate
 * @returns Error message if invalid, null if valid
 */
export function validateAvatarFile(file: File): string | null {
  const validation = avatarImageSchema.safeParse(file);

  if (!validation.success) {
    const errors = z.flattenError(validation.error).formErrors;
    return errors[0] || "Invalid file";
  }

  return null;
}
