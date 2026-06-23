"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormValues,
} from "@/features/auth/validations";

export default function RegisterPage() {
  const [firebaseError, setFirebaseError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setFirebaseError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      await setDoc(doc(db, "users", data.email.toLowerCase()), {
        email: data.email.toLowerCase(),
        name: data.name,
        createdAt: new Date().toISOString(),
      });

      router.push("/rooms");
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      console.error("Register failed", err);

      if (firebaseErr.code === "auth/email-already-in-use") {
        setFirebaseError("User with this email already exists!");
      } else if (firebaseErr.code === "auth/weak-password") {
        setFirebaseError("Password is too weak. Minimum 6 characters.");
      } else {
        setFirebaseError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Join us to book your meeting spaces"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
            Sign in
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
          id="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
      </form>
    </AuthCard>
  );
}
