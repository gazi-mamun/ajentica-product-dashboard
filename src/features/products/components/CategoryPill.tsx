import type { Category } from "../types";

export function CategoryPill({ category }: { category: Category }) {
  return (
    <span className="w-max inline-block whitespace-nowrap rounded-md border border-info-soft bg-info-soft px-2.25 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-info">
      {category}
    </span>
  );
}
