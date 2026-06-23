"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/features/auth/AuthContext";
import UserProfile from "./UserProfile";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";



export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const getNavLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    return `text-2xl font-medium transition-colors relative group py-2 ${
      isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
    }`;
  };

  const getUnderlineClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    return `absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300 ease-out ${
      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <nav className="flex items-center justify-between px-10 py-6 max-w-[100rem] mx-auto">
        <div className="flex items-center gap-16">
          <Logo />
          {!loading && user && (
            <div className="hidden md:flex gap-10">
              <Link href="/rooms" className={getNavLinkClass("/rooms")}>
                Rooms
                <span className={getUnderlineClass("/rooms")}></span>
              </Link>
              <Link href="/bookings" className={getNavLinkClass("/bookings")}>
                Bookings
                <span className={getUnderlineClass("/bookings")}></span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          {!loading && user ? (
            <div className="flex items-center gap-6">
              <UserProfile displayName={user.displayName} email={user.email} />
              <button onClick={handleLogout} className="text-2xl font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-2xl font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-2xl font-semibold px-8 py-4 rounded-full bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
