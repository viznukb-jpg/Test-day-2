import React, { forwardRef } from "react";
import { formStyles } from "./formStyles";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = "text", ...props }, ref) => {
    return (
      <div className={formStyles.inputGroup}>
        <div className="flex items-center justify-between">
          <label htmlFor={props.id} className={formStyles.label}>
            {label}
          </label>
        </div>
        <input
          type={type}
          ref={ref}
          className={`${formStyles.input} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : ""
          }`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
