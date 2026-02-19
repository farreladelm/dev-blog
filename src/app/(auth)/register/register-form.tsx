"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState } from "react"
import { registerAction } from "@/actions/auth"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {

  const [data, action, isPending] = useActionState(registerAction, undefined);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your email below to register for an account
          </CardDescription>
          {data?.error && (
            <p className="mt-2 text-sm text-red-600">{data.error}</p>
          )}
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  key={data?.submittedData?.email ?? ""}
                  defaultValue={data?.submittedData?.email ?? ""}
                  required
                />
                {data?.fieldErrors?.email && (
                  <small className="text-sm text-red-600">{data.fieldErrors.email}</small>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="example_user"
                  key={data?.submittedData?.username ?? ""}
                  defaultValue={data?.submittedData?.username ?? ""}
                  required
                />
                {data?.fieldErrors?.username && (
                  <small className="text-sm text-red-600">{data.fieldErrors.username}</small>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" name="password" placeholder="password..." required />
                {data?.fieldErrors?.password && (
                  <small className="text-sm text-red-600">{data.fieldErrors.password}</small>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="passwordConfirmation">Password Confirmation</FieldLabel>
                </div>
                <Input id="passwordConfirmation" type="password" name="passwordConfirmation" placeholder="confirm password..." required />
                {data?.fieldErrors?.passwordConfirmation && (
                  <small className="text-sm text-red-600">{data.fieldErrors.passwordConfirmation}</small>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending} className="cursor-pointer">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
