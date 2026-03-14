import { z } from "zod";

import type { SourceAudit } from "@/lib/games/shared/types";
import type {
  YugiohMetaArchetypeStat,
  YugiohMetaDeckSample,
  YugiohMetaSnapshot,
} from "@/lib/games/yugioh/types";

const YGOPRODECK_DECK_API_ROOT = "https://ygoprodeck.com/api/decks/getDecks.php";
const YGOPRODECK_HEADERS = {
  Accept: "application/json",
  "User-Agent": "CardLab/0.1 (romanxmanuel@gmail.com)",
};

const MetaDeckSchema = z.object({
  deck_name: z.string(),
  main_deck: z.string(),
  extra_deck: z.string(),
  side_deck: z.string(),
  pretty_url: z.string(),
  submit_date: z.string().nullable().optional(),
  tournamentName: z.string().nullable().optional(),
  tournamentPlacement: z.string().nullable().optional(),
});

export type YugiohMetaDeckRecord = {
  deckName: string;
  deckUrl: string;
  submitDateLabel: string | null;
  tournamentName: string | null;
  placement: string | null;
  mainDeckIds: number[];
  extraDeckIds: number[];
  sideDeckIds: number[];
};

function buildSourceAudit(sourceUrl: string, notes: string): SourceAudit[] {
  return [
    {
      sourceName: "YGOPRODeck",
      sourceType: "community",
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      confidence: "medium",
      notes,
    },
  ];
}

function parseDeckIds(serializedIds: string) {
  try {
    const parsed = z.array(z.union([z.string(), z.number()])).parse(JSON.parse(serializedIds));
    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0);
  } catch {
    return [];
  }
}

async function fetchYgoprodeckMetaDecks(path: string) {
  const response = await fetch(`${YGOPRODECK_DECK_API_ROOT}${path}`, {
    headers: YGOPRODECK_HEADERS,
    next: {
      revalidate: 60 * 30,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`YGOPRODeck meta request failed: ${response.status}${errorBody ? ` - ${errorBody}` : ""}`);
  }

  return z.array(MetaDeckSchema).parse(await response.json());
}

export async function fetchTournamentMetaDecks({
  query,
  limit = 20,
  offset = 0,
}: {
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  decks: YugiohMetaDeckRecord[];
  sourceAudit: SourceAudit[];
}> {
  const params = new URLSearchParams({
    format: "tournament meta decks",
    limit: String(limit),
    offset: String(offset),
  });

  if (query) {
    params.set("name", query);
  }

  const sourceUrl = `${YGOPRODECK_DECK_API_ROOT}?${params.toString()}`;
  const payload = await fetchYgoprodeckMetaDecks(`?${params.toString()}`);

  return {
    decks: payload.map((deck) => ({
      deckName: deck.deck_name,
      deckUrl: `https://ygoprodeck.com/deck/${deck.pretty_url}`,
      submitDateLabel: deck.submit_date ?? null,
      tournamentName: deck.tournamentName ?? null,
      placement: deck.tournamentPlacement ?? null,
      mainDeckIds: parseDeckIds(deck.main_deck),
      extraDeckIds: parseDeckIds(deck.extra_deck),
      sideDeckIds: parseDeckIds(deck.side_deck),
    })),
    sourceAudit: buildSourceAudit(
      sourceUrl,
      query
        ? `Pulled recent YGOPRODeck tournament-meta decklists matching "${query}".`
        : "Pulled the recent YGOPRODeck Tournament Meta Decks field snapshot.",
    ),
  };
}

function countDeckNames(decks: YugiohMetaDeckRecord[]) {
  const counts = new Map<string, number>();

  for (const deck of decks) {
    counts.set(deck.deckName, (counts.get(deck.deckName) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

export function buildYugiohMetaSnapshot({
  themeQuery,
  matchedDecks,
  fieldDecks,
}: {
  themeQuery: string;
  matchedDecks: YugiohMetaDeckRecord[];
  fieldDecks: YugiohMetaDeckRecord[];
}): YugiohMetaSnapshot {
  const topFieldDecks: YugiohMetaArchetypeStat[] = countDeckNames(fieldDecks).slice(0, 6);
  const matchedDeckSamples: YugiohMetaDeckSample[] = matchedDecks.slice(0, 5).map((deck) => ({
    deckName: deck.deckName,
    deckUrl: deck.deckUrl,
    tournamentName: deck.tournamentName,
    placement: deck.placement,
    submitDateLabel: deck.submitDateLabel,
  }));

  return {
    themeQuery,
    matchedDeckCount: matchedDecks.length,
    fieldSampleSize: fieldDecks.length,
    topFieldDecks,
    matchedDecks: matchedDeckSamples,
  };
}
