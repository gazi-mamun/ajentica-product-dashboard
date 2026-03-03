import { FiCheck, FiStar } from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import type { Product } from "../types";
import { CategoryPill } from "./CategoryPill";
import { cn } from "../../../utils/cn";

export interface GridCardProps {
  product: Product;
  selected: boolean;
  favorited: boolean;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
}

export function GridCard({
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
