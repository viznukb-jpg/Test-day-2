import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group mr-8 flex items-center gap-4 text-4xl font-extrabold tracking-tighter"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
        <Building2 className="h-8 w-8" />
      </div>
      <span className="bg-linear-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
        BOOKING APP
      </span>
    </Link>
  );
}
