"use client";

import { useAuth } from "@/features/auth/AuthContext";

export default function RoomsPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Meeting Rooms</h1>
      <p>This is a protected page. You are logged in as {user.email}.</p>
    </div>
  );
}
