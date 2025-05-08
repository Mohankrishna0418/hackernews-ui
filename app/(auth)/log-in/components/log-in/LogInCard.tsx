"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Caption } from "@/components/ui/caption";
import { Spinner } from "@/components/ui/spinner";

import { useForm } from "@tanstack/react-form";
import { auth } from "@/lib/auth";
import { emailSchema } from "@/lib/extras/schemas/email";
import { z } from "zod";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LogInCard = () => {
  const router = useRouter();
  const [logInError, setLogInError] = useState<Error | null>(null);

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (value) => {
      const { email, password } = value.value;

      const { error } = await auth.signIn.email({
        email,
        password
      });

      if (error) {
        setLogInError(new Error("Unable to log in currently!"));
        return;
      }

      router.replace("/");
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto w-full max-w-md bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md rounded-xl transition-colors duration-300">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Log in to your account</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <form
            className="flex flex-col items-stretch gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            {/* Email Field */}
            <Field
              name="email"
              validators={{
                onSubmit: (value) => {
                  const { error } = emailSchema.safeParse(value.value);
                  if (error && error.errors.length > 0) {
                    return error.errors[0].message;
                  }
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col items-stretch gap-2">
                  <Label
                    htmlFor={field.name}
                    className="text-[var(--color-foreground)]"
                  >
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="email"
                    placeholder="Email"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-[var(--color-input)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <Caption variant="error">
                      {field.state.meta.errors.join(" | ")}
                    </Caption>
                  )}
                </div>
              )}
            </Field>

            {/* Password Field */}
            <Field
              name="password"
              validators={{
                onSubmit: (value) => {
                  const passwordSchema = z
                    .string()
                    .min(1, "Password cannot be empty");

                  const { error } = passwordSchema.safeParse(value.value);
                  if (error && error.errors.length > 0) {
                    return error.errors[0].message;
                  }
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col items-stretch gap-2">
                  <Label
                    htmlFor={field.name}
                    className="text-[var(--color-foreground)]"
                  >
                    Password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    placeholder="Password"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-[var(--color-input)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <Caption variant="error">
                      {field.state.meta.errors.join(" | ")}
                    </Caption>
                  )}
                </div>
              )}
            </Field>

            {/* Submit Button */}
            <Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting && <Spinner />}
                  Log In
                </Button>
              )}
            </Subscribe>
          </form>
        </CardContent>

        <Separator />

        {/* Error Display */}
        {logInError !== null && (
          <>
            <CardContent>
              <Caption variant="error">{logInError.message}</Caption>
            </CardContent>
            <Separator />
          </>
        )}

        {/* Link to Sign Up */}
        <CardContent>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign Up
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
