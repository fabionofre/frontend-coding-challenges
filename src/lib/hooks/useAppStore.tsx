import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HouseType } from "@lib/constants/houses";

interface AppState {
  preferredHouse: HouseType | null | undefined;
  setPreferredHouse: (house: HouseType | null | undefined) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      preferredHouse: undefined,
      setPreferredHouse: (preferredHouse) => set(() => ({ preferredHouse })),
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favoriteId) => favoriteId !== id)
            : [...state.favorites, id],
        })),
    }),
    {
      name: "the-harry-potter-app-storage",
    }
  )
);
