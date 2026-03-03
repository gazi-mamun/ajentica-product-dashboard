import type { ReactNode } from "react";
import { FiSearch } from "react-icons/fi";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = <FiSearch className="h-8.5 w-8.5" />,
}: EmptyStateProps) {
  return (
    <div className="px-5 py-13 text-center">
      <div className="mb-2.5 flex justify-center text-dim">{icon}</div>
      <div className="mb-1 text-[14px] font-bold text-dim">{title}</div>
      {description && <div className="text-[12px] text-dim">{description}</div>}
    </div>
  );
}
