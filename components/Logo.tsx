import Link from "next/link";
import { Building2 } from "lucide-react";



export default function Logo() {
  return (
    <Link href="/" className="font-extrabold text-4xl tracking-tighter mr-8 flex items-center gap-4 group">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
        <Building2 className="w-8 h-8" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-800">BOOKING APP</span>
    </Link>
  );
}
