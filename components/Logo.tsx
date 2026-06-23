import Link from "next/link";
import { Building2 } from "lucide-react";

const styles = {
  container:
    "font-extrabold text-4xl tracking-tighter mr-8 flex items-center gap-4 group",
  iconWrapper:
    "w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300",
  icon: "w-8 h-8",
  text: "bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-800",
};

export default function Logo() {
  return (
    <Link href="/" className={styles.container}>
      <div className={styles.iconWrapper}>
        <Building2 className={styles.icon} />
      </div>
      <span className={styles.text}>BOOKING APP</span>
    </Link>
  );
}
