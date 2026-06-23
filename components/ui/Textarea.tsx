import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-3">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-xl font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`block min-h-30 w-full resize-y rounded-2xl border border-gray-200 bg-gray-50/50 px-6 py-5 text-2xl text-gray-900 placeholder-gray-400 transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
