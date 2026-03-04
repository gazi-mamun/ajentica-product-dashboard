import { memo, useRef } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { FiCheck, FiStar } from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import type { Product } from "../types";
import { CategoryPill } from "./CategoryPill";
import { ProductImg } from "./ProductImg";
import { cn } from "../../../utils/cn";

interface ProductVirtualTableProps {
  products: Product[];
  favoriteSet: Set<string>;
  selectedSet: Set<string>;
  onToggleFavorite: (id: string) => void;
  onToggleSelected: (id: string) => void;
}

const ROW_HEIGHT = 64;
const COL_TEMPLATE = "40px minmax(260px,1fr) 160px 120px 60px";

function ProductVirtualTableComponent({
  products,
  favoriteSet,
  selectedSet,
  onToggleFavorite,
  onToggleSelected,
}: ProductVirtualTableProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  // Align virtual row coordinates to this block's document offset.
  const scrollMargin = bodyRef.current?.offsetTop ?? 0;

  const rowVirtualizer = useWindowVirtualizer({
    count: products.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    scrollMargin,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div className="overflow-x-auto bg-panel">
      <div className="min-w-190">
        {/* Fixed header remains always visible while body rows are virtualized below. */}
        <div
          className="grid border-b border-strong"
          style={{ gridTemplateColumns: COL_TEMPLATE }}
        >
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
            <div
              key={header.key}
              className={cn(
                "whitespace-nowrap px-3.5 py-2.75 text-[10px] font-bold uppercase tracking-widest text-dim",
                header.key === "price"
                  ? "text-right"
                  : header.key === "select" || header.key === "favorite"
                    ? "text-center"
                    : "text-left",
              )}
            >
              {header.content}
            </div>
          ))}
        </div>

        <div ref={bodyRef} className="bg-panel">
          <div
            className="relative w-full bg-panel"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {virtualRows.map((virtualRow) => {
              // Render only rows inside/near viewport; lookup state from memoized ID sets.
              const product = products[virtualRow.index];
              const selected = selectedSet.has(product.id);
              const favorited = favoriteSet.has(product.id);

              return (
                <div
                  key={virtualRow.key}
                  onClick={() => onToggleSelected(product.id)}
                  className={cn(
                    "absolute left-0 top-0 grid w-full cursor-pointer items-center border-b border-strong transition-colors duration-150 hover:bg-row-hover",
                    selected && "bg-info-soft",
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                    gridTemplateColumns: COL_TEMPLATE,
                  }}
                >
                  <div className="flex h-full items-center px-3.5">
                    <div
                      className={cn(
                        "flex h-4.25 w-4.25 items-center justify-center rounded-[5px] border-2 transition-all duration-150 shrink-0",
                        selected
                          ? "border-info bg-current text-info"
                          : "border-dim bg-transparent",
                      )}
                    >
                      {selected && <FiCheck className="h-3 w-3 text-check" />}
                    </div>
                  </div>

                  <div className="flex h-full items-center px-3.5">
                    <div className="flex items-center gap-2.75">
                      <ProductImg
                        src={product.image}
                        alt={product.title}
                        size={42}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-bold text-secondary">
                          {product.title}
                        </div>
                        <div className="mt-px font-mono text-[10px] text-dim">
                          #{product.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full items-center px-3.5">
                    <CategoryPill category={product.category} />
                  </div>

                  <div className="flex h-full items-center justify-end px-3.5 text-right">
                    <span className="font-mono text-[15px] font-extrabold text-info">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex h-full items-center justify-center px-3.5 text-center">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(product.id);
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductVirtualTable = memo(ProductVirtualTableComponent);
