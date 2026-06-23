import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", disabled, children, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      className={`flex w-full justify-center rounded-2xl border border-transparent px-6 py-5 text-2xl font-bold text-white shadow-xl shadow-indigo-500/20 transition-all focus:ring-4 focus:ring-indigo-500/30 focus:outline-none ${
        disabled
          ? "cursor-not-allowed bg-indigo-400 opacity-70"
          : "bg-indigo-600 hover:-translate-y-1 hover:bg-indigo-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}
