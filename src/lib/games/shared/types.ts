export type GameId = "mtg" | "yugioh";

export type SourceAudit = {
  sourceName: string;
  sourceType: "official" | "community" | "derived";
  sourceUrl: string;
  fetchedAt: string;
  confidence?: "low" | "medium" | "high";
  notes?: string;
};

export type ImageSet = {
  full: string | null;
  small: string | null;
  crop: string | null;
};

export type PrintProfile = {
  game: GameId;
  cardWidthMm: number;
  cardHeightMm: number;
  gutterMm: number;
  cardsPerPage: number;
  supportsCalibration: boolean;
};
