# Ingestion Operations

This document defines how source ingestion should work once implementation begins.

## Goal

Keep the app honest, lightweight, and explainable by separating:
- live end-user requests
- normalized snapshots
- derived recommendation logic

## Ingestion Layers

### 1. Card reference layer
Purpose:
- canonical searchable card records

MTG:
- Scryfall

Yu-Gi-Oh:
- YGOPRODeck

### 2. Meta corpus layer
Purpose:
- recent deck snapshots and archetype trends

MTG:
- EDHREC and Commander Spellbook enrichment

Yu-Gi-Oh:
- normalized public deck pages and recent archetype pages

### 3. Derived intelligence layer
Purpose:
- frequencies
- common packages
- freshness
- confidence
- role labels

## Runtime vs Snapshot

Recommended rule:
- card search may be live or cached
- meta recommendations should prefer snapshots over live scraping on every request

Why:
- more stable
- less brittle
- easier to explain
- better for Vercel

## Yu-Gi-Oh Ingestion Plan

### Stage 1
- on-demand fetches through server routes
- minimal normalization
- source-audit attached to responses

### Stage 2
- snapshot recent deck pages into a lightweight local or shared cache
- compute:
  - inclusion frequency
  - common packages
  - freshness
  - confidence

### Stage 3
- cache or re-host selected print-quality assets
- add scheduled refresh workflow if needed

## Snapshot Record

Suggested normalized snapshot record:

```ts
type NormalizedDeckSnapshot = {
  id: string;
  game: "mtg" | "yugioh";
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  title: string | null;
  theme: string | null;
  formatMode: string | null;
  cards: Array<{
    name: string;
    quantity: number;
    section: string;
  }>;
};
```

## Freshness Rules

Suggested freshness states:
- `fresh`
- `aging`
- `stale`

Suggested initial thresholds:
- fresh: `0-14 days`
- aging: `15-45 days`
- stale: `46+ days`

These thresholds can be tuned later, but the UI should always expose freshness for meta-sensitive recommendations.

## Confidence Rules

Confidence should not be guessed manually.

It should be derived from:
- sample size
- freshness
- consistency of inclusion patterns
- source diversity

Suggested first output:
- `low`
- `medium`
- `high`

## Operational Guardrails

Do not:
- repeatedly hot-scrape the same public pages on every user request
- present stale snapshots as current
- mix official and community source claims without labels
- treat remote image links as permanent print infrastructure

## Vercel Constraint

The app should remain Vercel-light.

That means:
- keep live requests small
- avoid large server-side dependencies for ingestion in the first pass
- prefer normalized snapshots over complex always-live crawling
- defer heavy scheduled pipelines until the product proves the need

## First Operational Milestone

The first real operational win for Yu-Gi-Oh is:
- source-audited card search
- source-audited archetype search
- source-audited meta snapshot responses

That alone gives the product an honest intelligence backbone.
