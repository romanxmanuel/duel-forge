# Meta Pipeline

This document describes how the repository should gather, store, and use meta information without bluffing or overstating what the system knows.

## Core Rule

The system must not pretend to know the live meta unless it has explicitly fetched and stored a meta corpus.

That means:
- no unsupported claims based on model memory
- no vague "meta-aware" wording without source-backed evidence
- no hidden assumptions about current dominant decks

## Pipeline Goals

The meta pipeline should support:
- recent decklist ingestion
- archetype trend awareness
- inclusion frequency analysis
- matchup-oriented recommendation inputs
- source freshness and confidence reporting

## MTG Meta Inputs

Current MTG meta inputs:
- EDHREC commander pages
- Commander Spellbook combo signals

These sources support Commander-specific recommendation and pressure analysis, but the product should still present them honestly as source-backed enrichment rather than universal truth.

## Yu-Gi-Oh Meta Inputs

The initial Yu-Gi-Oh meta corpus should come from public community deck sources.

Recommended starting corpus:
- recent YGOPRODeck deck pages
- recent YGOPRODeck archetype pages
- recent top-archetype pages

Future optional enrichment:
- public official deck recipes from Neuron
- separate format-specific corpora such as `Master Duel`

## Snapshot Model

The pipeline should store source snapshots rather than relying on live scraping during every user request.

Suggested snapshot shape:

```ts
type SourceSnapshot = {
  id: string;
  game: "mtg" | "yugioh";
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  formatMode: string | null;
  theme: string | null;
  deckTitle: string | null;
  cards: Array<{
    name: string;
    quantity: number;
    section: "main" | "extra" | "side" | "commander" | "maindeck";
  }>;
};
```

This does not need to be the final production type, but it captures the right boundary.

## Derived Meta Features

Once snapshots exist, the app can derive:
- archetype frequency
- common engine size
- common staple packages
- common tech choices
- common Extra Deck clusters
- common side packages
- likely matchup pressure points

These features become the inputs for the generator's `meta-aware` rebuilds.

## Confidence Model

Every meta-backed recommendation should carry a confidence signal.

Inputs to confidence:
- number of matching recent decks
- freshness of corpus
- diversity of sources
- consistency of inclusion pattern

Example:
- `High confidence`: 40 recent matching lists with consistent core package
- `Low confidence`: 5 lists with highly divergent builds

## Freshness Rules

The UI should surface freshness for any meta-dependent recommendation.

Suggested freshness messaging:
- `fresh`
- `aging`
- `stale`

Suggested logic:
- fresh: within 14 days
- aging: 15 to 45 days
- stale: older than 45 days

Exact thresholds can change, but the principle should remain.

## Ingestion Strategy

Recommended staged approach:

### Stage 1
- on-demand server fetches with revalidation
- keep the corpus small and explicit

### Stage 2
- scheduled ingestion and normalization
- lightweight local snapshot cache

### Stage 3
- persistent shared storage if the corpus grows enough to justify it

The app should remain lightweight while the corpus is still small.

## Meta Usage Rules

Allowed uses:
- ranking candidate tech packages
- suggesting anti-meta rebuilds
- identifying common engine ratios
- explaining why a package is recommended

Disallowed uses:
- declaring a card mandatory without source evidence
- asserting current tier rankings without a visible corpus
- saying a deck beats the field without explanation

## Relationship To The Generator

The meta pipeline should inform the generator, not override structural logic.

Priority order:
1. structural viability
2. archetype coherence
3. user intent
4. meta tuning

That order matters because a "meta-aware" list that bricks constantly is still a bad deck.
