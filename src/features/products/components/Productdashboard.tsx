import { useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiGrid,
  FiList,
  FiPackage,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import { useProducts } from "../hooks/useProducts";
import type { Category, Product } from "../types";
import { CATEGORIES } from "../types";
import { CategoryPill } from "../components/CategoryPill";
import { cn } from "../../../utils/cn";

const PAGE_SIZE = 24;

type SortKey = "title" | "price_asc" | "price_desc";
type ViewMode = "grid" | "table";

function ProductImg({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  const [errored, setErrored] = useState(false);
  const initials = alt
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

  if (errored) {
    return (
      <div
        className={cn(
          "shrink-0 bg-avatar-fallback text-avatar-fallback font-extrabold flex items-center justify-center",
          size > 60 ? "rounded-xl" : "rounded-lg",
        )}
        style={{ width: size, height: size, fontSize: size * 0.24 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={cn(
        "block shrink-0 object-cover",
        size > 60 ? "rounded-xl" : "rounded-lg",
      )}
      style={{ width: size, height: size }}
    />
  );
}

interface GridCardProps {
  product: Product;
  selected: boolean;
  favorited: boolean;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
}

function GridCard({
  product,
  selected,
  favorited,
  onSelect,
  onFavorite,
}: GridCardProps) {
  return (
    <div
      onClick={() => onSelect(product.id)}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-[1.5px] bg-card-gradient transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-card-hover hover:bg-card-gradient-hover",
        selected ? "border-info shadow-brand-soft" : "border-card shadow-card",
      )}
    >
      <div className="relative h-40 overflow-hidden bg-card-media">
        <img
          src={product.image}
          alt={product.title}
          className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.07]"
        />
        <div className="pointer-events-none absolute inset-0 bg-image-overlay" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite(product.id);
          }}
          className={cn(
            "absolute right-2.25 top-2.25 flex h-7.5 w-7.5 items-center justify-center rounded-[7px] border text-[15px] backdrop-blur-[6px] transition-all duration-150 cursor-pointer",
            favorited
              ? "border-warning-soft bg-warning-soft text-warning scale-[1.12]"
              : "border-transparent bg-overlay-dark text-info",
          )}
        >
          {favorited ? (
            <IoStar className="h-4 w-4" />
          ) : (
            <FiStar className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(product.id);
          }}
          className={cn(
            "absolute left-2.25 top-2.25 flex h-5 w-5 items-center justify-center rounded-md border-2 backdrop-blur-[6px] transition-all duration-150",
            selected
              ? "border-info bg-current text-info"
              : "border-overlay bg-overlay-dark",
          )}
        >
          {selected && <FiCheck className="h-3 w-3 text-check" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.75 p-[12px_14px_14px]">
        <CategoryPill category={product.category} />
        <div className="flex-1 text-[13px] font-bold leading-[1.35] text-secondary">
          {product.title}
        </div>
        <div className="mt-0.5 flex items-center justify-between border-t border-soft pt-2.25">
          <span className="font-mono text-[18px] font-extrabold tracking-[-0.02em] text-info">
            ${product.price.toFixed(2)}
          </span>
          <span className="font-mono text-[10px] text-dim">#{product.id}</span>
        </div>
      </div>
    </div>
  );
}

interface TableRowProps {
  product: Product;
  selected: boolean;
  favorited: boolean;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
}

function TableRow({
  product,
  selected,
  favorited,
  onSelect,
  onFavorite,
}: TableRowProps) {
  return (
    <tr
      onClick={() => onSelect(product.id)}
      className={cn(
        "cursor-pointer border-b border-strong transition-colors duration-150 hover:bg-row-hover",
        selected && "bg-info-soft",
      )}
    >
      <td className="w-10 px-3.5 py-2.5">
        <div
          className={cn(
            "flex h-4.25 w-4.25 items-center justify-center rounded-[5px] border-2 transition-all duration-150",
            selected
              ? "border-info bg-current text-info"
              : "border-dim bg-transparent",
          )}
        >
          {selected && <FiCheck className="h-3 w-3 text-check" />}
        </div>
      </td>
      <td className="px-3.5 py-2.5">
        <div className="flex items-center gap-2.75">
          <ProductImg src={product.image} alt={product.title} size={42} />
          <div>
            <div className="text-[13px] font-bold text-secondary">
              {product.title}
            </div>
            <div className="mt-px font-mono text-[10px] text-dim">
              #{product.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3.5 py-2.5">
        <CategoryPill category={product.category} />
      </td>
      <td className="px-3.5 py-2.5 text-right">
        <span className="font-mono text-[15px] font-extrabold text-info">
          ${product.price.toFixed(2)}
        </span>
      </td>
      <td className="px-3.5 py-2.5 text-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite(product.id);
          }}
          className={cn(
            "border-none bg-transparent text-[17px] transition-transform duration-150 cursor-pointer",
            favorited ? "scale-[1.15] text-warning" : "text-dim",
          )}
        >
          {favorited ? (
            <IoStar className="h-4 w-4" />
          ) : (
            <FiStar className="h-4 w-4" />
          )}
        </button>
      </td>
    </tr>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border-[1.5px] border-card bg-card-gradient"
        >
          <div className="h-40 bg-skeleton" />
          <div className="flex flex-col gap-2 p-[12px_14px_14px]">
            <div className="h-4.5 w-[45%] rounded bg-skeleton" />
            <div className="h-3.5 w-[85%] rounded bg-skeleton" />
            <div className="h-3.5 w-[60%] rounded bg-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDashboard() {
  const { data, isLoading, isError } = useProducts();

  const products = useMemo<Product[]>(() => {
    if (!data) return [];
    return data.allIds
      .map((id) => data.byId[id])
      .filter((item): item is Product => Boolean(item));
  }, [data]);

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

  const paginationItems = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 2)
    .reduce<(number | "…")[]>((acc, n, index, arr) => {
      if (index > 0 && n - (arr[index - 1] as number) > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-dashboard text-secondary">
      <header className="sticky top-0 z-100 border-b border-header bg-header backdrop-blur-[14px]">
        <div className="screen-layout flex h-15 items-center justify-between px-6">
          <div className="flex items-center gap-2.75">
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

          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-dim border-t-info" />
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
                className="flex items-center gap-1.5 rounded-lg border border-soft bg-surface px-3 py-1"
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

          {isError && (
            <div className="px-5 py-12 text-center">
              <div className="mb-2.5 flex justify-center text-danger">
                <FiAlertTriangle className="h-8 w-8" />
              </div>
              <div className="text-[14px] font-bold text-danger">
                Failed to load products
              </div>
              <div className="mt-1 text-[12px] text-dim">
                Check your network and try again
              </div>
            </div>
          )}

          {isLoading && (
            <div className="p-4">
              <SkeletonGrid />
            </div>
          )}

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
                <div className="px-5 py-13 text-center">
                  <div className="mb-2.5 flex justify-center text-dim">
                    <FiSearch className="h-8.5 w-8.5" />
                  </div>
                  <div className="mb-1 text-[14px] font-bold text-dim">
                    No products found
                  </div>
                  <div className="text-[12px] text-dim">
                    Try adjusting your search or category filter
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-strong px-4.5 py-3.25">
              <span className="text-[12px] text-dim">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </span>

              <div className="flex flex-wrap items-center gap-1.25">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  className={cn(
                    "h-7.5 rounded-[7px] border border-soft bg-surface px-3 text-[12px] font-semibold transition-all cursor-pointer",
                    safePage === 1
                      ? "cursor-not-allowed text-dim"
                      : "text-muted",
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
                      onClick={() => setPage(item as number)}
                      className={cn(
                        "h-7.5 w-7.5 rounded-[7px] border text-[12px] transition-all cursor-pointer",
                        safePage === item
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
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                  className={cn(
                    "h-7.5 rounded-[7px] border border-soft bg-surface px-3 text-[12px] font-semibold transition-all cursor-pointer",
                    safePage === totalPages
                      ? "cursor-not-allowed text-dim"
                      : "text-muted",
                  )}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
