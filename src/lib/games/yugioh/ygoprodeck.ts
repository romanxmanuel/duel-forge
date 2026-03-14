import { z } from "zod";

import type { SourceAudit } from "@/lib/games/shared/types";
import type {
  YugiohArchetype,
  YugiohArchetypeSearchResponse,
  YugiohCard,
  YugiohCardSearchResponse,
} from "@/lib/games/yugioh/types";

const YGOPRODECK_API_ROOT = "https://db.ygoprodeck.com/api/v7";
const YGOPRODECK_HEADERS = {
  Accept: "application/json",
  "User-Agent": "CardLab/0.1 (romanxmanuel@gmail.com)",
};

const ArchetypeSchema = z.object({
  archetype_name: z.string(),
});

const CardImageSchema = z.object({
  id: z.number(),
  image_url: z.string().url(),
  image_url_small: z.string().url().optional(),
  image_url_cropped: z.string().url().optional(),
});

const YgoprodeckCardSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  desc: z.string(),
  race: z.string().nullable().optional(),
  archetype: z.string().nullable().optional(),
  attribute: z.string().nullable().optional(),
  atk: z.number().nullable().optional(),
  def: z.number().nullable().optional(),
  level: z.number().nullable().optional(),
  rank: z.number().nullable().optional(),
  linkval: z.number().nullable().optional(),
  card_images: z.array(CardImageSchema).min(1),
});

const CardInfoResponseSchema = z.object({
  data: z.array(YgoprodeckCardSchema),
});

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

async function fetchYgoprodeck<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate: number }; allowEmptyResult?: boolean },
) {
  const response = await fetch(`${YGOPRODECK_API_ROOT}${path}`, {
    ...init,
    headers: {
      ...YGOPRODECK_HEADERS,
      ...(init?.headers ?? {}),
    },
    next: init?.next ?? {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    if (init?.allowEmptyResult && response.status === 400) {
      return null;
    }

    const errorBody = await response.text().catch(() => "");
    throw new Error(`YGOPRODeck request failed: ${response.status}${errorBody ? ` - ${errorBody}` : ""}`);
  }

  return (await response.json()) as T;
}

function normalizeCard(card: z.infer<typeof YgoprodeckCardSchema>): YugiohCard {
  const image = card.card_images[0];

  return {
    id: card.id,
    name: card.name,
    slug: toSlug(card.name),
    archetype: card.archetype ?? null,
    typeLine: card.type,
    desc: card.desc,
    race: card.race ?? null,
    attribute: card.attribute ?? null,
    levelRankLink: card.rank ?? card.level ?? card.linkval ?? null,
    atk: card.atk ?? null,
    def: card.def ?? null,
    images: {
      full: image.image_url,
      small: image.image_url_small ?? image.image_url,
      crop: image.image_url_cropped ?? image.image_url,
    },
    aliases: [],
  };
}

function normalizeArchetype(name: string): YugiohArchetype {
  return {
    id: toSlug(name),
    name,
    slug: toSlug(name),
  };
}

function scoreMatch(value: string, query: string) {
  const loweredValue = value.toLowerCase();
  const loweredQuery = query.toLowerCase();

  if (loweredValue === loweredQuery) {
    return 0;
  }

  if (loweredValue.startsWith(loweredQuery)) {
    return 1;
  }

  const index = loweredValue.indexOf(loweredQuery);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index + 10;
}

export async function searchYugiohArchetypes(query: string): Promise<YugiohArchetypeSearchResponse> {
  const payload = z.array(ArchetypeSchema).parse(
    await fetchYgoprodeck("/archetypes.php", {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }),
  );

  const archetypes = payload
    .map((item) => item.archetype_name)
    .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
    .sort((left, right) => scoreMatch(left, query) - scoreMatch(right, query) || left.localeCompare(right))
    .slice(0, 16)
    .map(normalizeArchetype);

  return {
    archetypes,
    sourceAudit: buildSourceAudit(
      `${YGOPRODECK_API_ROOT}/archetypes.php`,
      "Archetype search is filtered locally from the official YGOPRODeck archetype list.",
    ),
  };
}

export async function searchYugiohCards(query: string, archetype?: string): Promise<YugiohCardSearchResponse> {
  const params = new URLSearchParams({
    fname: query,
    num: "18",
    offset: "0",
  });

  if (archetype) {
    params.set("archetype", archetype);
  }

  const sourceUrl = `${YGOPRODECK_API_ROOT}/cardinfo.php?${params.toString()}`;
  const rawPayload = await fetchYgoprodeck(`/cardinfo.php?${params.toString()}`, {
    allowEmptyResult: true,
    next: {
      revalidate: 60 * 60 * 12,
    },
  });

  if (!rawPayload) {
    return {
      cards: [],
      sourceAudit: buildSourceAudit(
        sourceUrl,
        archetype
          ? `No YGOPRODeck cards matched "${query}" inside the ${archetype} archetype.`
          : `No YGOPRODeck cards matched "${query}".`,
      ),
    };
  }

  const payload = CardInfoResponseSchema.parse(
    rawPayload,
  );

  return {
    cards: payload.data.map(normalizeCard),
    sourceAudit: buildSourceAudit(
      sourceUrl,
      archetype
        ? `Card search filtered within the ${archetype} archetype using YGOPRODeck card data.`
        : "Card search uses YGOPRODeck's card information endpoint.",
    ),
  };
}
