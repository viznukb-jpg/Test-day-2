"use server";

import { cookies } from "next/headers";

export async function createSession(uid: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
