import Link from "next/link";
import Logo from "./Logo";

const styles = {
  header:
    "sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]",
  nav: "flex items-center justify-between px-10 py-6 max-w-7xl mx-auto",
  leftSection: "flex items-center gap-16",
  linksWrapper: "hidden md:flex gap-10",
  navLink:
    "text-2xl font-medium text-gray-500 hover:text-indigo-600 transition-colors relative group py-2",
  navLinkUnderline:
    "absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out",
  rightSection: "flex items-center gap-8",
  loginLink:
    "text-2xl font-medium text-gray-600 hover:text-indigo-600 transition-colors",
  signupLink:
    "text-2xl font-semibold px-8 py-4 rounded-full bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300",
};

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.leftSection}>
          <Logo />
          <div className={styles.linksWrapper}>
            <Link href="/rooms" className={styles.navLink}>
              Rooms
              <span className={styles.navLinkUnderline}></span>
            </Link>
            <Link href="/bookings" className={styles.navLink}>
              Bookings
              <span className={styles.navLinkUnderline}></span>
            </Link>
          </div>
        </div>

        <div className={styles.rightSection}>
          <Link href="/login" className={styles.loginLink}>
            Log in
          </Link>
          <Link href="/register" className={styles.signupLink}>
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
