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

const ESTIMATED_ROW_HEIGHT = 280;
const ROW_GAP = 13;
const COLUMN_GAP = 13;
const MIN_CARD_WIDTH = 200;

function getColumnCount(width: number): number {
  return Math.max(
    1,
    Math.floor((width + COLUMN_GAP) / (MIN_CARD_WIDTH + COLUMN_GAP)),
  );
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
    estimateSize: () => ESTIMATED_ROW_HEIGHT + ROW_GAP,
    overscan: 6,
    scrollMargin,
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [rowVirtualizer, columns, products.length]);

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
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(${MIN_CARD_WIDTH}px, 1fr))`,
                columnGap: `${COLUMN_GAP}px`,
                alignItems: "start",
                paddingBottom: `${ROW_GAP}px`,
                boxSizing: "border-box",
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
