import { useMemo, useState } from "react";
import { FiGrid, FiList, FiPackage, FiSearch, FiStar, FiX } from "react-icons/fi";
import { Pagination } from "../../../components/Pagination";
import { CATEGORIES } from "../types";
import type { Category, Product } from "../types";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { GridCard } from "../components/GridCard";
import { LoadingState } from "../components/LoadingState";
import { TableRow } from "../components/TableRow";
import { cn } from "../../../utils/cn";

const PAGE_SIZE = 24;

type SortKey = "title" | "price_asc" | "price_desc";
type ViewMode = "grid" | "table";

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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((state) => {
      const next = new Set(state);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((state) => {
      const next = new Set(state);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const catCounts = useMemo<Record<Category, number>>(() => {
    const counts: Record<Category, number> = {
      Electronics: 0,
      Fashion: 0,
      Home: 0,
      Sports: 0,
      Beauty: 0,
      Books: 0,
    };
    for (const product of products) counts[product.category] += 1;
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return products
      .filter(
        (product) =>
          (category === "All" || product.category === category) &&
          (product.title.toLowerCase().includes(query) ||
            product.id.includes(query)),
      )
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "price_asc") return a.price - b.price;
        return b.price - a.price;
      });
  }, [products, search, category, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategory = (value: Category | "All") => {
    setCategory(value);
    setPage(1);
  };

  const handleSort = (value: SortKey) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-dashboard text-secondary">
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
                Inventory · {products.length} items
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            {isLoading && (
              <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-dim border-t-info" />
            )}
            {[
              { label: "Total", val: filtered.length, color: "text-info" },
              {
                label: "Favorites",
                val: favorites.size,
                color: "text-warning",
              },
              { label: "Selected", val: selected.size, color: "text-selected" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-soft bg-surface px-3 py-1"
              >
                <span
                  className={cn(
                    "font-mono text-[15px] font-extrabold",
                    stat.color,
                  )}
                >
                  {stat.val}
                </span>
                <span className="text-[10px] font-medium text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="screen-layout flex flex-col gap-3.5 px-6 py-5.5">
        <div className="flex flex-wrap gap-1.75">
          <button
            type="button"
            onClick={() => handleCategory("All")}
            className={cn(
              "h-8 rounded-lg border px-3.5 text-[12px] font-bold tracking-[0.04em] transition-all cursor-pointer",
              category === "All"
                ? "border-info bg-brand text-white shadow-brand-soft"
                : "border-soft bg-surface text-subtle",
            )}
          >
            All{" "}
            <span className="font-medium opacity-55">({products.length})</span>
          </button>

          {CATEGORIES.map((item) => {
            const active = category === item;
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
            onChange={(event) => handleSort(event.target.value as SortKey)}
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

          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="inline-flex h-9.25 items-center gap-1.5 rounded-lg border border-danger-soft bg-danger-soft px-3.25 text-[12px] font-semibold text-danger cursor-pointer"
            >
              <FiX className="h-3.5 w-3.5" />
              Clear {selected.size}
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
              <span className="text-[11px] text-dim">
                Page {safePage} / {totalPages}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-info">
                {viewMode === "grid" ? "Grid" : "Table"}
              </span>
            </div>
          </div>

          {isError && <ErrorState onRetry={onRetry} />}

          {isLoading && <LoadingState />}

          {!isLoading && !isError && (
            <div className={viewMode === "grid" ? "p-4" : ""}>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.25">
                  {paginated.map((product) => (
                    <GridCard
                      key={product.id}
                      product={product}
                      selected={selected.has(product.id)}
                      favorited={favorites.has(product.id)}
                      onSelect={toggleSelect}
                      onFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[13px]">
                    <thead>
                      <tr className="border-b border-strong">
                        {[
                          { key: "select", content: "" },
                          { key: "product", content: "Product" },
                          { key: "category", content: "Category" },
                          { key: "price", content: "Price" },
                          {
                            key: "favorite",
                            content: <FiStar className="mx-auto h-3.5 w-3.5" />,
                          },
                        ].map((header) => (
                          <th
                            key={header.key}
                            className={cn(
                              "whitespace-nowrap px-3.5 py-2.75 text-[10px] font-bold uppercase tracking-widest text-dim",
                              header.key === "price"
                                ? "text-right"
                                : header.key === "select" ||
                                    header.key === "favorite"
                                  ? "text-center"
                                  : "text-left",
                            )}
                          >
                            {header.content}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((product) => (
                        <TableRow
                          key={product.id}
                          product={product}
                          selected={selected.has(product.id)}
                          favorited={favorites.has(product.id)}
                          onSelect={toggleSelect}
                          onFavorite={toggleFavorite}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filtered.length === 0 && (
                <EmptyState
                  title="No products found"
                  description="Try adjusting your search or category filter"
                />
              )}
            </div>
          )}

          {!isLoading && !isError && totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
