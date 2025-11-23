"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "@/src/lib/auth-client"; //import the auth client
import * as z from "zod";
import { useRouter } from "next/navigation";
import { FieldDescription } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const strongPasswordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/
);
const AuthFormSchema = z
  .object({
    email: z.email({
      error: "Invalid email address",
    }),
    password: z
      .string({ error: "Password is required" })
      .min(6, "password must be at least 6 characters")
      .regex(
        strongPasswordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
      )
      .trim(),
    confirmPassword: z
      .string({ error: "Password Confirmation is required" })
      .min(1, "password must be at least 1 character"),
    name: z
      .string({ error: "Full name is required" })
      .min(1, "Full name is required")
      .max(64, "Name must be less than 64 characters")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const AuthForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    setLoading(true);
    setError("");
    console.log(values);
    try {
      const result = await signUp.email({
        email: values.email,
        name: values.name,
        password: values.password,
        callbackURL: "/login",
      });
      if (result.error) {
        setError(result.error.message || "Sign up failed");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="bg-neutral-100 w-96">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First name and Last name"
                        {...field}
                        className="border border-gray-700"
                        type="text"
                        ref={inputRef}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="joe@example.com"
                        {...field}
                        className="border border-gray-700"
                        type="email"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="strong password..."
                        {...field}
                        className="border border-gray-700"
                        type="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="confirm password"
                        {...field}
                        className="border border-gray-700"
                        type="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={
                  loading ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting
                }
                type="submit"
                className="hover:cursor-pointer w-full"
                // size="lg"
              >
                {loading ? (
                  <Spinner className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </CardFooter>
      </Card>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AuthForm;
