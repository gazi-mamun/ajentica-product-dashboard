import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStoreState {
  favoriteIds: string[];
  selectedIds: string[];
  toggleFavorite: (id: string) => void;
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  clearFavorites: () => void;
}

function toggleId(ids: string[], id: string): string[] {
  // Persist as arrays for storage reliability; derive Sets only in UI hooks for lookup speed.
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

export const useFavoritesStore = create<FavoritesStoreState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      selectedIds: [],
      // Idempotent toggles keep caller logic simple across grid/table interactions.
      toggleFavorite: (id: string) =>
        set((state) => ({ favoriteIds: toggleId(state.favoriteIds, id) })),
      toggleSelected: (id: string) =>
        set((state) => ({ selectedIds: toggleId(state.selectedIds, id) })),
      clearSelected: () => set({ selectedIds: [] }),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: "pm-dashboard:v1",
    },
  ),
);
