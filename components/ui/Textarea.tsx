import React, { forwardRef } from "react";
import { formStyles } from "./formStyles";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={formStyles.inputGroup}>
        <div className="flex items-center justify-between">
          <label htmlFor={props.id} className={formStyles.label}>
            {label}
          </label>
        </div>
        <textarea
          ref={ref}
          className={`${formStyles.input} min-h-[120px] resize-y ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
