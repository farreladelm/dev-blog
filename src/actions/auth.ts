"use server";

import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setAuthCookie,
  clearAuthCookie,
} from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LoginActionState, RegisterActionState } from "@/lib/types";

const registerSchema = z.object({
  email: z.email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function registerAction(
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const parsed = registerSchema.safeParse({
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      return {
        fieldErrors: {
          email: fieldErrors.email?.[0],
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
        },
      };
    }

    const data = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      return { error: "Email or username already exists" };
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
    });

    const token = await createToken(user.id, user.username, user.username);
    await setAuthCookie(token);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    return { error: "Registration failed" };
  }

  redirect("/articles");
}

export async function loginAction(
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      return {
        fieldErrors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      };
    }

    const data = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await verifyPassword(data.password, user.password))) {
      return { error: "Invalid email or password" };
    }

    const token = await createToken(user.id, user.name, user.username);
    await setAuthCookie(token);
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    return { error: "Login failed" };
  }

  redirect("/articles");
}

export async function logoutAction(_: unknown, __: FormData) {
  await clearAuthCookie();
  redirect("/login");
}
