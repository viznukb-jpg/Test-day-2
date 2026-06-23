import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-10 inline-flex items-center gap-2 text-xl font-semibold text-gray-500 transition-colors hover:text-indigo-600"
    >
      <ArrowLeft size={24} />
      {label}
    </Link>
  );
}
