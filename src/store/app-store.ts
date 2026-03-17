"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type GameId = "mtg" | "yugioh";

type AppStoreState = {
  lastVisitedGame: GameId;
  setLastVisitedGame: (game: GameId) => void;
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      lastVisitedGame: "mtg",
      setLastVisitedGame: (lastVisitedGame) => set({ lastVisitedGame }),
    }),
    {
      name: "duel-forge-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastVisitedGame: state.lastVisitedGame,
      }),
    },
  ),
);
