# Architecture

This document describes the target architecture for evolving the repository from a single-product MTG application into a dual-product site that serves both `Magic: The Gathering` and `Yu-Gi-Oh!`.

## Current State

Today the repository is effectively an MTG-only app.

Key entry points:
- `src/app/page.tsx`
- `src/app/builder/page.tsx`
- `src/app/print/page.tsx`

Key MTG-specific domains:
- `src/lib/mtg/*`
- `src/store/deck-store.ts`
- `src/components/deck-builder/*`

This current structure is acceptable for a first Commander-focused release, but it is too MTG-specific to cleanly absorb Yu-Gi-Oh without a structural split.

## Target Product Model

The site should become one website with two separate products:

- `MTG Commander Lab`
- `Yu-Gi-Oh Duel Forge`

Shared:
- top navigation
- game switcher
- typography and theme system
- common card-preview overlay
- print/export primitives
- shared utility types where truly generic

Not shared:
- deck rules
- game data models
- generation logic
- source clients
- state stores
- terminology
- print dimensions

## Route Map

Recommended route structure:

- `/`
  - landing page or redirect to the last-used game
- `/mtg`
  - Commander builder
- `/mtg/print`
  - MTG print flow
- `/yugioh`
  - Yu-Gi-Oh builder
- `/yugioh/print`
  - Yu-Gi-Oh print flow

Recommended API structure:

- `/api/mtg/commanders`
- `/api/mtg/color-commanders`
- `/api/mtg/commander-meta`
- `/api/mtg/cards`
- `/api/mtg/deck-generate`
- `/api/yugioh/cards`
- `/api/yugioh/archetypes`
- `/api/yugioh/meta`
- `/api/yugioh/deck-generate`
- `/api/yugioh/opening-hands`
- `/api/yugioh/print-assets`

## Folder Structure

Recommended repository shape:

```text
src/
  app/
    layout.tsx
    page.tsx
    mtg/
      page.tsx
      print/page.tsx
    yugioh/
      page.tsx
      print/page.tsx
    api/
      mtg/...
      yugioh/...
  components/
    shell/
      app-header.tsx
      game-switcher.tsx
    shared/
      card-preview-overlay.tsx
      explainable-list.tsx
      source-badge.tsx
    mtg/
      deck-builder-app.tsx
      print-sheet.tsx
    yugioh/
      yugioh-builder-app.tsx
      yugioh-print-sheet.tsx
      opening-hand-tester.tsx
  lib/
    games/
      shared/
        print.ts
        source-audit.ts
        types.ts
      mtg/
        ...
      yugioh/
        archetypes.ts
        deck-generator.ts
        explainer.ts
        meta-corpus.ts
        role-classifier.ts
        structural-scoring.ts
        types.ts
        ygoprodeck.ts
  store/
    app-store.ts
    mtg-store.ts
    yugioh-store.ts
```

## Shared Application Layer

The shared shell should stay intentionally thin.

Recommended responsibilities:
- app header
- game switcher
- route-aware metadata helpers
- preview overlay
- print shell primitives
- shared error and loading patterns

The shared layer should not encode Commander assumptions or Yu-Gi-Oh deck-shape assumptions.

## State Architecture

Do not use one universal deck store.

### Shared app state
- active game
- last visited route
- shared UI preferences

### MTG store
- selected commander
- focus tag
- power preset
- deck entries
- build notes
- spellbook estimate

### Yu-Gi-Oh store
- selected theme
- selected format mode
- build intent
- strength target
- selected meta targets
- constraints
- main deck
- extra deck
- side deck
- explanation blocks
- source snapshot metadata

## Domain Model Strategy

There should be a small set of shared abstractions, but the games should keep separate internal types.

Safe shared abstractions:
- `GameId`
- `GameRoute`
- `SourceAudit`
- `PrintableCard`
- `PrintProfile`

Unsafe abstractions to force too early:
- one generic deck-entry type
- one generic format legality type
- one generic card-search result type for all game logic

The shared interfaces should only cover what the shell truly needs.

## Rendering Strategy

Recommended split:
- server components fetch and prepare source-backed data
- client components handle tuning, local edits, preview, and print UI
- state persistence remains browser-local first

This keeps the app Vercel-light while preserving room for later shared persistence.

## Source Boundaries

MTG and Yu-Gi-Oh should each have independent source clients and source audit models.

Recommended rule:
- canonical card data is fetched from one primary source per game
- official rules remain separate from community meta
- community meta gets timestamped and scored for freshness

## Printing Architecture

Printing should be a shared subsystem with per-game profiles.

Shared responsibilities:
- print page shell
- calibration support
- cut-guide layout helpers
- PDF-friendly print CSS

Game-specific responsibilities:
- card dimensions
- image source rules
- fallback placeholders
- layout density tuning

## Migration Strategy

Phase 1 should not try to build Yu-Gi-Oh immediately. It should first make MTG route-aware and game-aware without changing MTG behavior.

Migration steps:
1. move existing MTG entry points under `/mtg`
2. add shared app header and game switcher
3. split current store into `mtg-store.ts`
4. move `src/lib/mtg/*` under `src/lib/games/mtg/*`
5. add empty Yu-Gi-Oh route and domain scaffolding
6. only then begin Yu-Gi-Oh product logic

## Phased Roadmap

### Phase 1: platform split
- separate routes
- shared shell
- app-level switcher
- MTG behavior unchanged

### Phase 2: Yu-Gi-Oh data scaffolding
- YGOPRODeck client
- archetype resolver
- source-audit model
- initial print profile

### Phase 3: Yu-Gi-Oh generator MVP
- theme input
- Main / Extra / Side shell generation
- structural scoring
- explanation blocks

### Phase 4: Yu-Gi-Oh tuning intelligence
- dynamic option sets
- meta targeting
- consistency scoring
- rebuild variants

### Phase 5: advanced systems
- opening-hand tester
- combo line viewer
- export workflows
- improved image caching

## Employer-Facing Quality Bar

This repository may be shown to employers. The architecture should therefore optimize for:

- explicit source boundaries
- professional naming
- honest documentation
- maintainable structure
- clear separation of product concerns
