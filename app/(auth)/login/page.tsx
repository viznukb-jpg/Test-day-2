"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/features/auth/validations";

export default function LoginPage() {
  const [firebaseError, setFirebaseError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/rooms");
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      console.error("Login failed", err);
      if (
        firebaseErr.code === "auth/user-not-found" ||
        firebaseErr.code === "auth/invalid-email"
      ) {
        setFirebaseError("User with this email not found!");
      } else if (
        firebaseErr.code === "auth/wrong-password" ||
        firebaseErr.code === "auth/invalid-credential"
      ) {
        setFirebaseError("Invalid email or password. Please check your credentials.");
      } else {
        setFirebaseError("Login failed. Please try again.");
      }
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your bookings"
      footer={
        <>
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
            Sign up now
          </Link>
        </>
      }
    >
      {firebaseError && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-lg text-red-600">
          {firebaseError}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
