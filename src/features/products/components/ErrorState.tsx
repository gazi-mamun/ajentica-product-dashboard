import { FiAlertTriangle } from "react-icons/fi";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load products",
  description = "Check your network and try again",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="mb-2.5 flex justify-center text-danger">
        <FiAlertTriangle className="h-8 w-8" />
      </div>
      <div className="text-[14px] font-bold text-danger">{title}</div>
      <div className="mt-1 text-[12px] text-dim">{description}</div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-8 items-center rounded-[7px] border border-danger-soft bg-danger-soft px-3 text-[12px] font-semibold text-danger cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}
