"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { authStyles as styles } from "@/features/auth/styles";
import { formStyles } from "@/components/ui/formStyles";
import { setSessionCookie } from "@/features/auth/actions";
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/features/auth/validations";

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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update the user's profile with their name immediately after creation!
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      router.push("/rooms");
    } catch (err: any) {
      console.error("Register failed", err);
      if (err.code === "auth/email-already-in-use") {
        setFirebaseError("Користувач з такою поштою вже існує!");
      } else if (err.code === "auth/weak-password") {
        setFirebaseError("Пароль надто слабкий. Мінімум 6 символів.");
      } else {
        setFirebaseError("Помилка реєстрації. Спробуйте ще раз.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.subtitle}>Join us to book your meeting spaces</p>

        {firebaseError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-lg text-center">
            {firebaseError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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

          <button type="submit" disabled={isSubmitting} className={formStyles.button}>
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
