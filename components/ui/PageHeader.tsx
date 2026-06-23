import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          {title}
        </h1>
        <p className="text-lg text-gray-500 md:text-xl">{description}</p>
      </div>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
