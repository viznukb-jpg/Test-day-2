import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
}

export function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-500">
          {description}
        </p>
      </div>
      
      {actionButton && (
        <div>
          {actionButton}
        </div>
      )}
    </div>
  );
}
