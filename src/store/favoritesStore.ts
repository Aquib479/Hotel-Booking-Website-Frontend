import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Property } from "@/features/search/types";

interface FavoritesState {
  items: Record<string, Property>;
  toggle: (property: Property) => void;
  remove: (id: string) => void;
  isFavorite: (id: string) => boolean;
  list: () => Property[];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: {},

      toggle: (property) => {
        set((state) => {
          const next = { ...state.items };
          if (next[property.id]) {
            delete next[property.id];
          } else {
            next[property.id] = property;
          }
          return { items: next };
        });
      },

      remove: (id) => {
        set((state) => {
          if (!state.items[id]) return state;
          const next = { ...state.items };
          delete next[id];
          return { items: next };
        });
      },

      isFavorite: (id) => Boolean(get().items[id]),

      list: () => Object.values(get().items),
    }),
    {
      name: "resthalf-favorites",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
