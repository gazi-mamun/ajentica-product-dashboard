import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Product } from "../types";
import { GridCard } from "./GridCard";

interface ProductVirtualGridProps {
  products: Product[];
  favoriteSet: Set<string>;
  selectedSet: Set<string>;
  onToggleFavorite: (id: string) => void;
  onToggleSelected: (id: string) => void;
}

const ROW_HEIGHT = 260;
const GRID_GAP = 13;

function getColumnCount(width: number): number {
  if (width < 520) return 1;
  if (width < 860) return 2;
  if (width < 1160) return 3;
  return 4;
}

export function ProductVirtualGrid({
  products,
  favoriteSet,
  selectedSet,
  onToggleFavorite,
  onToggleSelected,
}: ProductVirtualGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollMargin = containerRef.current?.offsetTop ?? 0;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setContainerWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const columns = useMemo(
    () => getColumnCount(containerWidth),
    [containerWidth],
  );
  const rowCount = Math.ceil(products.length / columns);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
    scrollMargin,
  });

  const rowItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={containerRef} className="p-4">
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowItems.map((virtualRow) => {
          const start = virtualRow.index * columns;
          const end = Math.min(start + columns, products.length);
          const rowProducts = products.slice(start, end);

          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(200px, 1fr))`,
                gap: `${GRID_GAP}px`,
              }}
            >
              {rowProducts.map((product) => (
                <GridCard
                  key={product.id}
                  product={product}
                  selected={selectedSet.has(product.id)}
                  favorited={favoriteSet.has(product.id)}
                  onSelect={onToggleSelected}
                  onFavorite={onToggleFavorite}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
