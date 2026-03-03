import { useEffect, useMemo, useState } from "react";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { CATEGORIES } from "../types";
import type { Category, Product } from "../types";

const PAGE_SIZE = 24;

type SortKey = "title" | "price_asc" | "price_desc";
type ViewMode = "grid" | "table";
type DashboardQueryState = {
  search: string;
  categories: Category[];
  sortBy: SortKey;
  viewMode: ViewMode;
  page: number;
};

const DEFAULT_QUERY_STATE: DashboardQueryState = {
  search: "",
  categories: [],
  sortBy: "title",
  viewMode: "grid",
  page: 1,
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
  const params = new URLSearchParams(searchText);
  const search = params.get("search") ?? DEFAULT_QUERY_STATE.search;
  const categoriesParam = params.get("categories");
  const sortByParam = params.get("sortBy");
  const viewModeParam = params.get("viewMode");
  const pageParam = Number(params.get("page"));
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
    page: Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : DEFAULT_QUERY_STATE.page,
  };
}

export function useProductDashboardState(products: Product[]) {
  const initialQueryState =
    typeof window === "undefined"
      ? DEFAULT_QUERY_STATE
      : parseQueryState(window.location.search);

  const [viewMode, setViewMode] = useState<ViewMode>(initialQueryState.viewMode);
  const [search, setSearch] = useState(initialQueryState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQueryState.search);
  const [categories, setCategories] = useState<Category[]>(initialQueryState.categories);
  const [sortBy, setSortBy] = useState<SortKey>(initialQueryState.sortBy);
  const [page, setPage] = useState(initialQueryState.page);
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const onPopState = () => {
      const next = parseQueryState(window.location.search);
      setSearch(next.search);
      setCategories(next.categories);
      setSortBy(next.sortBy);
      setViewMode(next.viewMode);
      setPage(next.page);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categories.length > 0) params.set("categories", categories.join(","));
    if (sortBy !== "title") params.set("sortBy", sortBy);
    if (viewMode !== "grid") params.set("viewMode", viewMode);
    if (page > 1) params.set("page", String(page));
    const nextQuery = params.toString();
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [search, categories, sortBy, viewMode, page]);

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
    if (value === "All") {
      setCategories([]);
      setPage(1);
      return;
    }

    setCategories((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
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
