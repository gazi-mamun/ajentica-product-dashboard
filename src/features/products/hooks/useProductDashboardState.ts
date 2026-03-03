import { useEffect, useMemo, useState } from "react";
import { useFavoritesStore } from "../../../store/favoritesStore";
import type { Category, Product } from "../types";

const PAGE_SIZE = 24;

type SortKey = "title" | "price_asc" | "price_desc";
type ViewMode = "grid" | "table";

export function useProductDashboardState(products: Product[]) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [page, setPage] = useState(1);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const selectedIds = useFavoritesStore((state) => state.selectedIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const toggleSelected = useFavoritesStore((state) => state.toggleSelected);
  const clearSelected = useFavoritesStore((state) => state.clearSelected);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  useEffect(() => {
    if (favoriteIds.length === 0) setFavoritesOnly(false);
  }, [favoriteIds.length]);

  useEffect(() => {
    if (selectedIds.length === 0) setSelectedOnly(false);
  }, [selectedIds.length]);

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
          (!favoritesOnly || favoriteSet.has(product.id)) &&
          (!selectedOnly || selectedSet.has(product.id)) &&
          (category === "All" || product.category === category) &&
          (product.title.toLowerCase().includes(query) ||
            product.id.includes(query)),
      )
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "price_asc") return a.price - b.price;
        return b.price - a.price;
      });
  }, [
    products,
    search,
    category,
    sortBy,
    favoritesOnly,
    selectedOnly,
    favoriteSet,
    selectedSet,
  ]);

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

  const toggleFavoritesOnly = () => {
    setFavoritesOnly((prev) => !prev);
    setPage(1);
  };

  const toggleSelectedOnly = () => {
    setSelectedOnly((prev) => !prev);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return {
    viewMode,
    setViewMode,
    search,
    category,
    sortBy,
    favoritesOnly,
    selectedOnly,
    favoriteIds,
    selectedIds,
    favoriteSet,
    selectedSet,
    catCounts,
    filtered,
    totalPages,
    safePage,
    paginated,
    pageSize: PAGE_SIZE,
    handleSearch,
    handleCategory,
    handleSort,
    toggleFavorite,
    toggleSelected,
    clearSelected,
    toggleFavoritesOnly,
    toggleSelectedOnly,
    handlePageChange,
  };
}
