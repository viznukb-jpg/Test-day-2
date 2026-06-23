"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { authStyles as styles } from "@/features/auth/styles";
import { formStyles } from "@/components/ui/formStyles";
import { Input } from "@/components/ui/Input";
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
    } catch (err: any) {
      console.error("Login failed", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-email"
      ) {
        setFirebaseError("Користувача з такою поштою не знайдено!");
      } else if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setFirebaseError("Невірний пароль або пошта. Перевірте введені дані.");
      } else {
        setFirebaseError("Помилка входу. Будь ласка, спробуйте ще раз.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to manage your bookings</p>

        {firebaseError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-lg text-red-600">
            {firebaseError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            type="email"
            label="Email address"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="relative">
            <Link
              href="#"
              className="absolute top-0 right-0 text-lg font-medium text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Forgot password?
            </Link>
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={formStyles.button}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <Link href="/register" className={styles.link}>
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
