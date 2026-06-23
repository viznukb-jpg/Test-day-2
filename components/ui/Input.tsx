import React, { forwardRef } from "react";
import { authStyles } from "@/features/auth/styles";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={authStyles.inputGroup}>
        <div className="flex items-center justify-between">
          <label htmlFor={props.id} className={authStyles.label}>
            {label}
          </label>
        </div>
        <input
          ref={ref}
          className={`${authStyles.input} ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
