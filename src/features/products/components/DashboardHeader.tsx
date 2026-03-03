import { FiPackage } from "react-icons/fi";
import { cn } from "../../../utils/cn";

interface DashboardHeaderProps {
  productsCount: number;
  isLoading: boolean;
  filteredCount: number;
  favoriteCount: number;
  selectedCount: number;
  favoritesOnly: boolean;
  selectedOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onToggleSelectedOnly: () => void;
}

export function DashboardHeader({
  productsCount,
  isLoading,
  filteredCount,
  favoriteCount,
  selectedCount,
  favoritesOnly,
  selectedOnly,
  onToggleFavoritesOnly,
  onToggleSelectedOnly,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-100 border-b border-header bg-header backdrop-blur-[14px]">
      <div className="screen-layout flex flex-col gap-2.5 px-4 py-3 sm:px-6 md:h-15 md:flex-row md:items-center md:justify-between md:py-0">
        <div className="flex min-w-0 items-center gap-2.75">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-brand-gradient text-base shadow-brand">
            <FiPackage className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-[-0.02em] text-primary">
              Product Dashboard
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-dim">
              Inventory · {productsCount} items
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
          {isLoading && (
            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-dim border-t-info" />
          )}
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-soft bg-surface px-3 py-1">
            <span className="font-mono text-[15px] font-extrabold text-info">
              {filteredCount}
            </span>
            <span className="text-[10px] font-medium text-muted">Total</span>
          </div>
          <button
            type="button"
            disabled={favoriteCount === 0}
            onClick={onToggleFavoritesOnly}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1",
              favoritesOnly
                ? "border-warning-soft bg-warning-soft"
                : "border-soft bg-surface",
              favoriteCount === 0
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer",
            )}
          >
            <span className="font-mono text-[15px] font-extrabold text-warning">
              {favoriteCount}
            </span>
            <span className="text-[10px] font-medium text-muted">Favorites</span>
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={onToggleSelectedOnly}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1",
              selectedOnly ? "border-info-soft bg-info-soft" : "border-soft bg-surface",
              selectedCount === 0
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer",
            )}
          >
            <span className="font-mono text-[15px] font-extrabold text-selected">
              {selectedCount}
            </span>
            <span className="text-[10px] font-medium text-muted">Selected</span>
          </button>
        </div>
      </div>
    </header>
  );
}
