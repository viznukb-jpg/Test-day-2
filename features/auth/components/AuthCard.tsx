import React from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
      <div className="w-full max-w-2xl rounded-4xl border border-gray-100 bg-white p-12 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.2)] sm:p-16">
        <h2 className="mb-4 text-center text-5xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mb-12 text-center text-2xl text-gray-500">{subtitle}</p>

        {children}

        {footer && (
          <div className="mt-10 text-center text-xl text-gray-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
