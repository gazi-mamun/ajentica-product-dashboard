import { useEffect, useMemo, useState } from "react";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { CATEGORIES } from "../types";
import type { Category, Product } from "../types";

type SortKey = "title" | "price_asc" | "price_desc";
type ViewMode = "grid" | "table";
type DashboardQueryState = {
  search: string;
  categories: Category[];
  sortBy: SortKey;
  viewMode: ViewMode;
};

const DEFAULT_QUERY_STATE: DashboardQueryState = {
  search: "",
  categories: [],
  sortBy: "title",
  viewMode: "grid",
};

function isSortKey(value: string): value is SortKey {
  return value === "title" || value === "price_asc" || value === "price_desc";
}

function isViewMode(value: string): value is ViewMode {
  return value === "grid" || value === "table";
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

function parseQueryState(searchText: string): DashboardQueryState {
  // Parse only the URL-driven dashboard controls; everything else stays local/store state.
  const params = new URLSearchParams(searchText);
  const search = params.get("search") ?? DEFAULT_QUERY_STATE.search;
  const categoriesParam = params.get("categories");
  const sortByParam = params.get("sortBy");
  const viewModeParam = params.get("viewMode");
  const parsedCategories = (categoriesParam ?? "")
    .split(",")
    .filter(Boolean)
    .filter(isCategory);

  return {
    search,
    categories: Array.from(new Set(parsedCategories)),
    sortBy: sortByParam && isSortKey(sortByParam)
      ? sortByParam
      : DEFAULT_QUERY_STATE.sortBy,
    viewMode: viewModeParam && isViewMode(viewModeParam)
      ? viewModeParam
      : DEFAULT_QUERY_STATE.viewMode,
  };
}

export function useProductDashboardState(products: Product[]) {
  // Hydrate dashboard controls from URL so refresh/share/back-forward preserve UI context.
  const initialQueryState =
    typeof window === "undefined"
      ? DEFAULT_QUERY_STATE
      : parseQueryState(window.location.search);

  const [viewMode, setViewMode] = useState<ViewMode>(initialQueryState.viewMode);
  const [search, setSearch] = useState(initialQueryState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQueryState.search);
  const [categories, setCategories] = useState<Category[]>(initialQueryState.categories);
  const [sortBy, setSortBy] = useState<SortKey>(initialQueryState.sortBy);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const selectedIds = useFavoritesStore((state) => state.selectedIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const toggleSelected = useFavoritesStore((state) => state.toggleSelected);
  const clearSelected = useFavoritesStore((state) => state.clearSelected);

  // O(1) lookup sets used by filtering and virtual row render paths.
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  useEffect(() => {
    if (favoriteIds.length === 0) setFavoritesOnly(false);
  }, [favoriteIds.length]);

  useEffect(() => {
    if (selectedIds.length === 0) setSelectedOnly(false);
  }, [selectedIds.length]);

  useEffect(() => {
    // Keep type-ahead responsive while deferring expensive filter/sort work.
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // Sync URL -> state for browser navigation (back/forward).
    const onPopState = () => {
      const next = parseQueryState(window.location.search);
      setSearch(next.search);
      setCategories(next.categories);
      setSortBy(next.sortBy);
      setViewMode(next.viewMode);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Sync state -> URL without creating history entries for every keystroke/toggle.
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categories.length > 0) params.set("categories", categories.join(","));
    if (sortBy !== "title") params.set("sortBy", sortBy);
    if (viewMode !== "grid") params.set("viewMode", viewMode);
    const nextQuery = params.toString();
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [search, categories, sortBy, viewMode]);

  const catCounts = useMemo<Record<Category, number>>(() => {
    // Category counters are based on the full fetched dataset, not current filters.
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
    // Single derived pipeline for all discovery controls before virtualization renders rows.
    const query = debouncedSearch.toLowerCase();
    return products
      .filter(
        (product) =>
          (!favoritesOnly || favoriteSet.has(product.id)) &&
          (!selectedOnly || selectedSet.has(product.id)) &&
          (categories.length === 0 || categories.includes(product.category)) &&
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
    debouncedSearch,
    categories,
    sortBy,
    favoritesOnly,
    selectedOnly,
    favoriteSet,
    selectedSet,
  ]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCategory = (value: Category | "All") => {
    if (value === "All") {
      setCategories([]);
      return;
    }

    setCategories((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const handleSort = (value: SortKey) => {
    setSortBy(value);
  };

  const toggleFavoritesOnly = () => {
    setFavoritesOnly((prev) => !prev);
  };

  const toggleSelectedOnly = () => {
    setSelectedOnly((prev) => !prev);
  };

  return {
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
  };
}
