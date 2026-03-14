"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAppStore, type GameId } from "@/store/app-store";

const GAME_LINKS: Array<{ game: GameId; href: string; label: string }> = [
  { game: "mtg", href: "/mtg", label: "Magic: The Gathering" },
  { game: "yugioh", href: "/yugioh", label: "Yu-Gi-Oh!" },
];

function resolveActiveGame(pathname: string, fallbackGame: GameId): GameId {
  if (pathname.startsWith("/yugioh")) {
    return "yugioh";
  }

  if (pathname.startsWith("/mtg") || pathname.startsWith("/builder") || pathname.startsWith("/print")) {
    return "mtg";
  }

  return fallbackGame;
}

export function GameSwitcher() {
  const pathname = usePathname();
  const lastVisitedGame = useAppStore((state) => state.lastVisitedGame);
  const setLastVisitedGame = useAppStore((state) => state.setLastVisitedGame);

  const activeGame = resolveActiveGame(pathname, lastVisitedGame);

  useEffect(() => {
    if (pathname !== "/") {
      setLastVisitedGame(activeGame);
    }
  }, [activeGame, pathname, setLastVisitedGame]);

  return (
    <nav className="game-switcher" aria-label="Select game">
      {GAME_LINKS.map((item) => (
        <Link
          key={item.game}
          href={item.href}
          className={`game-switcher-link ${activeGame === item.game ? "game-switcher-link-active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
