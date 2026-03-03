import { cn } from "../utils/cn";
import { getPaginationItems } from "../utils/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const paginationItems = getPaginationItems(totalPages, currentPage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-strong px-4.5 py-3.25">
      <span className="text-[12px] text-dim">
        Showing {(currentPage - 1) * pageSize + 1}–
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
      </span>

      <div className="flex flex-wrap items-center gap-1.25">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            "h-7.5 rounded-[7px] border border-soft bg-surface px-3 text-[12px] font-semibold transition-all cursor-pointer",
            currentPage === 1 ? "cursor-not-allowed text-dim" : "text-muted",
          )}
        >
          ← Prev
        </button>

        {paginationItems.map((item, index) =>
          item === "…" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-[12px] text-dim"
            >
              …
            </span>
          ) : (
            <button
              type="button"
              key={item}
              onClick={() => onPageChange(item as number)}
              className={cn(
                "h-7.5 w-7.5 rounded-[7px] border text-[12px] transition-all cursor-pointer",
                currentPage === item
                  ? "border-info bg-info-soft font-bold text-info"
                  : "border-soft bg-surface font-medium text-subtle",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            "h-7.5 rounded-[7px] border border-soft bg-surface px-3 text-[12px] font-semibold transition-all cursor-pointer",
            currentPage === totalPages
              ? "cursor-not-allowed text-dim"
              : "text-muted",
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
