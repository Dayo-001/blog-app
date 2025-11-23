"use client";
import React, { useEffect, useRef } from "react";
// import AuthForm from "./AuthForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/src/lib/auth-client";
import { FieldDescription } from "@/components/ui/field";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const AuthFormSchema = z.object({
  email: z.email({
    error: "Invalid email address",
  }),
  password: z
    .string({ error: "Password is required" })
    .min(6, "password must be at least 6 characters")

    .trim(),
});

const AuthCard = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  // const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    setLoading(true);
    setError("");
    console.log(values);
    try {
      const result = await signIn.email({
        email: values.email, // required
        password: values.password, // required
        rememberMe: false,
        callbackURL: callbackUrl,
      });
      if (result.error) {
        setError(result.error.message || "Sign in failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmitGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
      console.log(result);
      if (result.error) {
        console.log("I don't have a result");
        setError(result.error.message || "Sign in failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitGithub = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
      });
      console.log(result);
      if (result.error) {
        console.log("I don't have a result");
        setError(result.error.message || "Sign in failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibilityOnMouseDown = () => {
    setShowPassword(true);
  };
  const togglePasswordVisibilityOnMouseUp = () => {
    setShowPassword(false);
  };
  return (
    <div>
      <Card className="bg-neutral-100 w-96">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        ref={inputRef}
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/"
                        className="ml-auto inline-block text-xs underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <div
                        className={cn(
                          "relative flex file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                        )}
                      >
                        <input
                          placeholder="password..."
                          {...field}
                          className="outline-none"
                          type={showPassword ? "text" : "password"}
                        />
                        <Button
                          className="absolute right-1 bottom-2  text-gray-500 hover:text-gray-700 focus:outline-none bg-accent h-[0.5px] hover:bg-accent"
                          type="button"
                          onMouseDown={togglePasswordVisibilityOnMouseDown}
                          onMouseUp={togglePasswordVisibilityOnMouseUp}
                          onMouseLeave={togglePasswordVisibilityOnMouseUp}
                        >
                          {showPassword ? (
                            <FaEye size={10} />
                          ) : (
                            <FaEyeSlash size={10} />
                          )}
                        </Button>
                      </div>
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
                {loading ? <Spinner className="animate-spin" /> : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full hover:cursor-pointer"
            variant="outline"
            type="button"
            disabled={loading}
            onClick={onSubmitGoogle}
          >
            <FcGoogle />
            Sign in with Google
          </Button>
          <Button
            className="w-full hover:cursor-pointer"
            variant="outline"
            type="button"
            disabled={loading}
            onClick={onSubmitGithub}
          >
            <FaGithub />
            Sign in with Github
          </Button>
          <CardFooter>
            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </FieldDescription>
          </CardFooter>
        </CardFooter>
      </Card>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AuthCard;
