import type {
  CommanderOption,
  DeckEntry,
  PowerPreset,
  SpellbookDeckEstimate,
  TagOption,
} from "@/lib/mtg/types";
import type {
  YugiohGeneratedDeckResponse,
  YugiohThemeSelection,
  YugiohCard,
  YugiohDeckEntry,
} from "@/lib/games/yugioh/types";

const ygoCard = (
  id: number,
  name: string,
  typeLine: string,
  image: string,
  archetype: string | null,
): YugiohCard => ({
  id,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  archetype,
  typeLine,
  desc: `${name} sample text for README screenshots.`,
  race: null,
  attribute: null,
  levelRankLink: null,
  atk: null,
  def: null,
  images: {
    small: image,
    full: image,
    crop: image,
  },
  aliases: [],
});

function ygoEntry(card: YugiohCard, quantity: number, section: YugiohDeckEntry["section"], roles: YugiohDeckEntry["roles"], rationale: string, locked = false): YugiohDeckEntry {
  return {
    card,
    quantity,
    section,
    roles,
    rationale,
    locked,
  };
}

export const README_MTG_COMMANDER: CommanderOption = {
  id: "atraxa-grand-unifier",
  name: "Atraxa, Grand Unifier",
  slug: "atraxa-grand-unifier",
  typeLine: "Legendary Creature — Phyrexian Angel",
  oracleText:
    "Flying, vigilance, deathtouch, lifelink. When Atraxa enters, reveal the top ten cards of your library and put one of each card type into your hand.",
  colorIdentity: ["W", "U", "B", "G"],
  colors: ["W", "U", "B", "G"],
  imageUris: {
    normal: "https://cards.scryfall.io/normal/front/3/f/3f796368-1d88-4891-a8f3-cf1921098dd3.jpg?1675957056",
    png: "https://cards.scryfall.io/png/front/3/f/3f796368-1d88-4891-a8f3-cf1921098dd3.png?1675957056",
    artCrop: "https://cards.scryfall.io/art_crop/front/3/f/3f796368-1d88-4891-a8f3-cf1921098dd3.jpg?1675957056",
  },
  source: "scryfall",
};

export const README_MTG_FOCUS_TAG: TagOption = {
  label: "Blink",
  slug: "blink",
};

export const README_MTG_POWER: PowerPreset = "high";

export const README_MTG_ENTRIES: DeckEntry[] = [
  {
    id: "sol-ring",
    name: "Sol Ring",
    slug: "sol-ring",
    manaCost: "{1}",
    typeLine: "Artifact",
    oracleText: "{T}: Add {C}{C}.",
    colorIdentity: [],
    colors: [],
    cmc: 1,
    imageUris: {
      normal: "https://cards.scryfall.io/normal/front/b/1/b16d1b4f-8a22-414d-b5f5-dc8f95d65f24.jpg?1686966925",
      png: "https://cards.scryfall.io/png/front/b/1/b16d1b4f-8a22-414d-b5f5-dc8f95d65f24.png?1686966925",
      artCrop: "https://cards.scryfall.io/art_crop/front/b/1/b16d1b4f-8a22-414d-b5f5-dc8f95d65f24.jpg?1686966925",
    },
    edhrecRank: 1,
    legalCommander: true,
    isBasicLand: false,
    layout: "normal",
    quantity: 1,
    role: "ramp",
    notes: "Fast mana for earlier Atraxa turns.",
  },
  {
    id: "swords-to-plowshares",
    name: "Swords to Plowshares",
    slug: "swords-to-plowshares",
    manaCost: "{W}",
    typeLine: "Instant",
    oracleText: "Exile target creature.",
    colorIdentity: ["W"],
    colors: ["W"],
    cmc: 1,
    imageUris: {
      normal: "https://cards.scryfall.io/normal/front/0/3/03b22ec1-0dbb-4b4d-b2a0-f8eb471e67f8.jpg?1702429238",
      png: "https://cards.scryfall.io/png/front/0/3/03b22ec1-0dbb-4b4d-b2a0-f8eb471e67f8.png?1702429238",
      artCrop: "https://cards.scryfall.io/art_crop/front/0/3/03b22ec1-0dbb-4b4d-b2a0-f8eb471e67f8.jpg?1702429238",
    },
    edhrecRank: 10,
    legalCommander: true,
    isBasicLand: false,
    layout: "normal",
    quantity: 1,
    role: "interaction",
  },
  {
    id: "ephemerate",
    name: "Ephemerate",
    slug: "ephemerate",
    manaCost: "{W}",
    typeLine: "Instant",
    oracleText: "Exile target creature you control, then return it to the battlefield.",
    colorIdentity: ["W"],
    colors: ["W"],
    cmc: 1,
    imageUris: {
      normal: "https://cards.scryfall.io/normal/front/1/0/10adfa97-c34d-4ae7-8918-27f6cf9fcb1b.jpg?1689998382",
      png: "https://cards.scryfall.io/png/front/1/0/10adfa97-c34d-4ae7-8918-27f6cf9fcb1b.png?1689998382",
      artCrop: "https://cards.scryfall.io/art_crop/front/1/0/10adfa97-c34d-4ae7-8918-27f6cf9fcb1b.jpg?1689998382",
    },
    edhrecRank: 300,
    legalCommander: true,
    isBasicLand: false,
    layout: "normal",
    quantity: 1,
    role: "synergy",
  },
  {
    id: "smothering-tithe",
    name: "Smothering Tithe",
    slug: "smothering-tithe",
    manaCost: "{3}{W}",
    typeLine: "Enchantment",
    oracleText: "Whenever an opponent draws a card, they may pay {2}.",
    colorIdentity: ["W"],
    colors: ["W"],
    cmc: 4,
    imageUris: {
      normal: "https://cards.scryfall.io/normal/front/0/8/08df4b66-a720-45cc-b862-3fa3f5e2dc4f.jpg?1674142476",
      png: "https://cards.scryfall.io/png/front/0/8/08df4b66-a720-45cc-b862-3fa3f5e2dc4f.png?1674142476",
      artCrop: "https://cards.scryfall.io/art_crop/front/0/8/08df4b66-a720-45cc-b862-3fa3f5e2dc4f.jpg?1674142476",
    },
    edhrecRank: 12,
    legalCommander: true,
    isBasicLand: false,
    layout: "normal",
    quantity: 1,
    role: "ramp",
  },
  {
    id: "cyclonic-rift",
    name: "Cyclonic Rift",
    slug: "cyclonic-rift",
    manaCost: "{1}{U}",
    typeLine: "Instant",
    oracleText: "Return target nonland permanent you don't control to its owner's hand.",
    colorIdentity: ["U"],
    colors: ["U"],
    cmc: 2,
    imageUris: {
      normal: "https://cards.scryfall.io/normal/front/0/f/0fcb8cb1-c8c5-45cb-b58b-c06ffe97fe22.jpg?1592706048",
      png: "https://cards.scryfall.io/png/front/0/f/0fcb8cb1-c8c5-45cb-b58b-c06ffe97fe22.png?1592706048",
      artCrop: "https://cards.scryfall.io/art_crop/front/0/f/0fcb8cb1-c8c5-45cb-b58b-c06ffe97fe22.jpg?1592706048",
    },
    edhrecRank: 14,
    legalCommander: true,
    isBasicLand: false,
    layout: "normal",
    quantity: 1,
    role: "wipe",
  },
  {
    id: "command-tower",
    name: "Command Tower",
    slug: "command-tower",
    manaCost: null,
    typeLine: "Land",
    oracleText: "{T}: Add one mana of any color in your commander's color identity.",
    colorIdentity: ["W", "U", "B", "R", "G"],
    colors: [],
    cmc: 0,
    imageUris: {
      normal: "https://cards.scryfall.io/normal/front/3/1/31f93b08-f5ea-4c5d-a76c-ebf5f4d58d4f.jpg?1706240537",
      png: "https://cards.scryfall.io/png/front/3/1/31f93b08-f5ea-4c5d-a76c-ebf5f4d58d4f.png?1706240537",
      artCrop: "https://cards.scryfall.io/art_crop/front/3/1/31f93b08-f5ea-4c5d-a76c-ebf5f4d58d4f.jpg?1706240537",
    },
    edhrecRank: 2,
    legalCommander: true,
    isBasicLand: false,
    layout: "normal",
    quantity: 1,
    role: "land",
  },
];

export const README_MTG_BUILD_NOTES = [
  "Atraxa stays the centerpiece while blink cards double down on ETB velocity.",
  "The list leans into premium interaction and fast mana to reach the first Atraxa trigger earlier.",
  "High-power tuning keeps the draw engine dense without sliding all the way into cEDH.",
];

export const README_MTG_SPELLBOOK: SpellbookDeckEstimate = {
  bracketTag: "C",
  bracketLabel: "High Power",
  gameChangerCards: ["Mana Crypt", "Smothering Tithe"],
  massLandDenialCards: [],
  extraTurnCards: [],
  comboCount: 5,
  twoCardComboCount: 2,
  lockComboCount: 0,
  extraTurnComboCount: 0,
  comboHighlights: [
    {
      id: "demo-atraxa-1",
      uses: ["Deadeye Navigator", "Peregrine Drake"],
      bracketTag: "C",
      description: "Infinite mana loop that turns Atraxa's card flow into a fast finish.",
      prerequisites: "Both creatures in play and enough mana to pair soulbond.",
      speed: 2,
    },
  ],
};

const yubel = ygoCard(
  78371393,
  "Yubel",
  "Effect Monster",
  "https://images.ygoprodeck.com/images/cards_small/78371393.jpg",
  "Yubel",
);
const samsara = ygoCard(
  31764700,
  "Samsara D Lotus",
  "Effect Monster",
  "https://images.ygoprodeck.com/images/cards_small/31764700.jpg",
  "Yubel",
);
const spiritGates = ygoCard(
  20366274,
  "Opening of the Spirit Gates",
  "Spell Card",
  "https://images.ygoprodeck.com/images/cards_small/20366274.jpg",
  "Yubel",
);
const nightmareThrone = ygoCard(
  47408488,
  "Nightmare Throne",
  "Spell Card",
  "https://images.ygoprodeck.com/images/cards_small/47408488.jpg",
  "Yubel",
);
const ashBlossom = ygoCard(
  14558127,
  "Ash Blossom & Joyous Spring",
  "Tuner Effect Monster",
  "https://images.ygoprodeck.com/images/cards_small/14558127.jpg",
  null,
);
const phantom = ygoCard(
  74717840,
  "Phantom of Yubel",
  "Fusion Effect Monster",
  "https://images.ygoprodeck.com/images/cards_small/74717840.jpg",
  "Yubel",
);
const lovingDefender = ygoCard(
  102380,
  "Yubel - The Loving Defender Forever",
  "Fusion Effect Monster",
  "https://images.ygoprodeck.com/images/cards_small/102380.jpg",
  "Yubel",
);

export const README_YGO_THEME: YugiohThemeSelection = {
  query: "Yubel",
  resolvedArchetype: "Yubel",
  resolvedBossCards: ["Yubel", "Phantom of Yubel"],
  resolvedSupportCards: ["Yubel", "Fiend Link"],
  inactiveBossCards: [],
  inactiveSupportCards: ["Unchained"],
};

export const README_YGO_GENERATED: YugiohGeneratedDeckResponse = {
  main: [
    ygoEntry(yubel, 2, "main", ["engine-core", "payoff"], "Core Yubel name for live fusion and recursion lines.", true),
    ygoEntry(samsara, 3, "main", ["starter", "engine-core"], "Primary starter that gets the Yubel engine online.", true),
    ygoEntry(spiritGates, 3, "main", ["searcher", "engine-support"], "Search and recycle tool that keeps the core running.", true),
    ygoEntry(nightmareThrone, 3, "main", ["starter", "searcher"], "Popular opener in the strongest Yubel versions."),
    ygoEntry(ashBlossom, 3, "main", ["hand-trap"], "Flexible interruption slot against broad combo decks."),
  ],
  extra: [
    ygoEntry(phantom, 2, "extra", ["payoff", "extra-toolbox"], "Most common extra-deck payoff in current Yubel lines.", true),
    ygoEntry(lovingDefender, 1, "extra", ["payoff", "extra-toolbox"], "Back-up closer that rewards the grind game."),
  ],
  side: [
    ygoEntry(ashBlossom, 1, "side", ["side-tech", "hand-trap"], "Extra interaction flex slot for tougher combo fields."),
  ],
  buildNotes: [
    "Built around Yubel with a stronger bias toward the most common modern Yubel version.",
    "Manual anchors stay active while flex slots lean into starters, extenders, and clean pressure.",
    "Popular version targeting makes the deck hug the higher-frequency Yubel lines instead of a loose blended pile.",
  ],
  sourceAudit: [],
  metaSnapshot: {
    themeQuery: "Yubel + Phantom of Yubel",
    matchedDeckCount: 18,
    fieldSampleSize: 40,
    topFieldDecks: [
      { name: "Yubel", count: 18 },
      { name: "Tenpai Dragon", count: 8 },
      { name: "Fiendsmith", count: 5 },
    ],
    matchedDecks: [
      {
        deckName: "Yubel Fiend Link",
        deckUrl: "https://ygoprodeck.com",
        tournamentName: "Regional",
        placement: "Top 8",
        submitDateLabel: "2026-03-10",
      },
    ],
    deckVersions: [
      {
        id: "yubel-fiend-link",
        label: "Yubel Fiend Link",
        count: 9,
        sampleDecks: [
          {
            deckName: "Yubel Fiend Link",
            deckUrl: "https://ygoprodeck.com",
            tournamentName: "Regional",
            placement: "Top 8",
            submitDateLabel: "2026-03-10",
          },
        ],
      },
      {
        id: "pure-yubel",
        label: "Pure Yubel",
        count: 6,
        sampleDecks: [
          {
            deckName: "Pure Yubel",
            deckUrl: "https://ygoprodeck.com",
            tournamentName: "Regional",
            placement: "Top 16",
            submitDateLabel: "2026-03-08",
          },
        ],
      },
    ],
    selectedDeckVersion: "yubel-fiend-link",
  },
  structuralReadout: {
    consistency: 88,
    synergy: 91,
    pressure: 86,
    adaptability: 79,
    structuralIntegrity: 90,
    finalScore: 89,
    warnings: [],
    notes: ["High-opener density with clear Yubel engine concentration."],
  },
};
