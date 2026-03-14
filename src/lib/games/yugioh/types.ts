import type { ImageSet, SourceAudit } from "@/lib/games/shared/types";

export type YugiohCard = {
  id: number;
  name: string;
  slug: string;
  archetype: string | null;
  typeLine: string;
  desc: string;
  race: string | null;
  attribute: string | null;
  levelRankLink: number | null;
  atk: number | null;
  def: number | null;
  images: ImageSet;
};

export type YugiohArchetype = {
  id: string;
  name: string;
  slug: string;
};

export type YugiohCardSearchResponse = {
  cards: YugiohCard[];
  sourceAudit: SourceAudit[];
};

export type YugiohArchetypeSearchResponse = {
  archetypes: YugiohArchetype[];
  sourceAudit: SourceAudit[];
};
