import { FiGrid, FiList, FiSearch, FiX } from "react-icons/fi";
import { CATEGORIES } from "../types";
import type { Product } from "../types";
import { DashboardHeader } from "../components/DashboardHeader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { ProductVirtualGrid } from "../components/ProductVirtualGrid";
import { ProductVirtualTable } from "../components/ProductVirtualTable";
import { useProductDashboardState } from "../hooks/useProductDashboardState";
import { cn } from "../../../utils/cn";

interface ProductDashboardViewProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export function ProductDashboardView({
  products,
  isLoading,
  isError,
  onRetry,
}: ProductDashboardViewProps) {
  const {
    viewMode,
    setViewMode,
    search,
    categories,
    sortBy,
    favoritesOnly,
    selectedOnly,
    favoriteIds,
    selectedIds,
    favoriteSet,
    selectedSet,
    catCounts,
    filtered,
    handleSearch,
    handleCategory,
    handleSort,
    toggleFavorite,
    toggleSelected,
    clearSelected,
    toggleFavoritesOnly,
    toggleSelectedOnly,
  } = useProductDashboardState(products);

  return (
    <div className="min-h-screen bg-dashboard text-secondary">
      <DashboardHeader
        productsCount={products.length}
        isLoading={isLoading}
        filteredCount={filtered.length}
        favoriteCount={favoriteIds.length}
        selectedCount={selectedIds.length}
        favoritesOnly={favoritesOnly}
        selectedOnly={selectedOnly}
        onToggleFavoritesOnly={toggleFavoritesOnly}
        onToggleSelectedOnly={toggleSelectedOnly}
      />

      <main className="screen-layout flex flex-col gap-3.5 px-6 py-5.5">
        <div className="flex flex-wrap gap-1.75">
          <button
            type="button"
            onClick={() => handleCategory("All")}
            className={cn(
              "h-8 rounded-lg border px-3.5 text-[12px] font-bold tracking-[0.04em] transition-all cursor-pointer",
              categories.length === 0
                ? "border-info bg-brand text-white shadow-brand-soft"
                : "border-soft bg-surface text-subtle",
            )}
          >
            All{" "}
            <span className="font-medium opacity-55">({products.length})</span>
          </button>

          {CATEGORIES.map((item) => {
            const active = categories.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => handleCategory(item)}
                className={cn(
                  "h-8 rounded-lg border px-3.5 text-[12px] font-bold tracking-[0.04em] transition-all cursor-pointer",
                  active
                    ? "border-info bg-info-soft text-info shadow-brand-soft"
                    : "border-soft bg-surface text-subtle",
                )}
              >
                {item}{" "}
                <span className="font-medium opacity-55">
                  ({catCounts[item] ?? 0})
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 rounded-[13px] border border-soft bg-panel p-[13px_16px]">
          <div className="relative min-w-55 flex-1">
            <span className="pointer-events-none absolute left-2.75 top-1/2 -translate-y-1/2 text-[13px] text-dim">
              <FiSearch className="h-3.5 w-3.5" />
            </span>
            <input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search by title or ID…"
              className="h-9.25 w-full rounded-lg border border-soft bg-surface-alt pl-8 pr-2.75 text-[13px] text-secondary outline-none placeholder:text-dim"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) =>
              handleSort(
                event.target.value as "title" | "price_asc" | "price_desc",
              )
            }
            className="h-9.25 min-w-42.5 rounded-lg border border-soft bg-surface-alt px-2.75 text-[13px] text-secondary outline-none cursor-pointer"
          >
            <option value="title">Sort: Title A → Z</option>
            <option value="price_asc">Sort: Price Low → High</option>
            <option value="price_desc">Sort: Price High → Low</option>
          </select>

          <div className="flex gap-0.5 rounded-lg border border-soft bg-surface-alt p-0.75">
            {(["grid", "table"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex h-7.75 items-center gap-1.25 rounded-md px-3.25 text-[12px] font-bold transition-all cursor-pointer",
                  viewMode === mode
                    ? "bg-brand-toggle text-white shadow-toggle"
                    : "text-dim",
                )}
              >
                {mode === "grid" ? (
                  <FiGrid className="h-3.5 w-3.5" />
                ) : (
                  <FiList className="h-3.5 w-3.5" />
                )}{" "}
                {mode === "grid" ? "Grid" : "Table"}
              </button>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={clearSelected}
              className="inline-flex h-9.25 items-center gap-1.5 rounded-lg border border-danger-soft bg-danger-soft px-3.25 text-[12px] font-semibold text-danger cursor-pointer"
            >
              <FiX className="h-3.5 w-3.5" />
              Clear {selectedIds.length}
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-[15px] border border-soft bg-panel">
          <div className="flex items-center justify-between border-b border-strong px-4.5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-extrabold text-primary">
                Products
              </span>
              <span className="text-[11px] text-dim">
                {filtered.length} results
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-info">
                {viewMode === "grid" ? "Grid" : "Table"}
              </span>
            </div>
          </div>

          {isError && <ErrorState onRetry={onRetry} />}

          {isLoading && <LoadingState />}

          {!isLoading && !isError && (
            <div>
              {viewMode === "grid" ? (
                <ProductVirtualGrid
                  products={filtered}
                  favoriteSet={favoriteSet}
                  selectedSet={selectedSet}
                  onToggleFavorite={toggleFavorite}
                  onToggleSelected={toggleSelected}
                />
              ) : (
                <ProductVirtualTable
                  products={filtered}
                  favoriteSet={favoriteSet}
                  selectedSet={selectedSet}
                  onToggleFavorite={toggleFavorite}
                  onToggleSelected={toggleSelected}
                />
              )}

              {filtered.length === 0 && (
                <EmptyState
                  title="No products found"
                  description="Try adjusting your search or category filter"
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
