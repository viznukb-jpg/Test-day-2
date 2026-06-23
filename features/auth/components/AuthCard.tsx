import React from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-2xl w-full bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.2)] p-12 sm:p-16 border border-gray-100">
        <h2 className="text-center text-5xl font-extrabold text-gray-900 mb-4">{title}</h2>
        <p className="text-center text-2xl text-gray-500 mb-12">{subtitle}</p>
        
        {children}

        {footer && (
          <div className="text-center text-xl text-gray-600 mt-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
