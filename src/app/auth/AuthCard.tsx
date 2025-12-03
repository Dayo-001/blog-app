"use client";
import React, { useEffect, useRef } from "react";
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
import { useRouter } from "next/navigation";
import { useSession } from "@/src/app/hooks/sessionContext";
import { startHolyLoader, stopHolyLoader } from "holy-loader";

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
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();

  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, sessionLoading, router]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
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
    mode: "all",
  });

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    setLoading(true);
    setError("");
    console.log(values);
    try {
      startHolyLoader();
      const result = await signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: false,
        callbackURL: callbackUrl,
      });
      if (result.error) {
        setError(result.error.message || "Sign in failed");
      }
    } catch (error) {
      stopHolyLoader();
      console.error(error);
    } finally {
      stopHolyLoader();
      setLoading(false);
    }
  };
  const onSubmitGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      startHolyLoader();
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
      stopHolyLoader();
      console.error(error);
    } finally {
      stopHolyLoader();
      setLoading(false);
    }
  };

  const onSubmitGithub = async () => {
    setLoading(true);
    setError("");
    try {
      startHolyLoader();
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
      stopHolyLoader();
      console.error(error);
    } finally {
      stopHolyLoader();
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
    <div className="min-h-screen flex items-center justify-center px-2 py-8">
      <Card className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-neutral-100 shadow-lg">
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
                          "relative flex rounded-md border border-black"
                        )}
                      >
                        <Input
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
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </div>
  );
};

export default AuthCard;
