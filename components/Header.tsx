"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/features/auth/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const styles = {
  header:
    "sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]",
  nav: "flex items-center justify-between px-10 py-6 max-w-7xl mx-auto",
  leftSection: "flex items-center gap-16",
  linksWrapper: "hidden md:flex gap-10",
  rightSection: "flex items-center gap-8",
  loginLink:
    "text-2xl font-medium text-gray-600 hover:text-indigo-600 transition-colors",
  signupLink:
    "text-2xl font-semibold px-8 py-4 rounded-full bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300",
  logoutButton: "text-2xl font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-colors",
};

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
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.leftSection}>
          <Logo />
          {!loading && user && (
            <div className={styles.linksWrapper}>
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

        <div className={styles.rightSection}>
          {!loading && user ? (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className={styles.loginLink}>
                Log in
              </Link>
              <Link href="/register" className={styles.signupLink}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
