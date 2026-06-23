interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-indigo-200 border-t-indigo-600`}
      />
    </div>
  );
}
