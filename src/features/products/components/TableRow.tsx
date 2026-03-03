import { FiCheck, FiStar } from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import type { Product } from "../types";
import { CategoryPill } from "./CategoryPill";
import { ProductImg } from "./ProductImg";
import { cn } from "../../../utils/cn";

export interface TableRowProps {
  product: Product;
  selected: boolean;
  favorited: boolean;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
}

export function TableRow({
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
