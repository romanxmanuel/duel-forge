# Phase 1 Shell Plan

This document is the exact planning handoff for the first implementation phase.

Phase 1 should not add Yu-Gi-Oh deck logic yet. It should only transform the current MTG-only app into a clean dual-product shell.

## Phase 1 Goal

Create a route-aware, employer-friendly site structure that:

- preserves existing MTG behavior
- introduces a top-level game switcher
- separates MTG into its own route space
- creates a clean landing point for a future Yu-Gi-Oh product

The important constraint is:
- MTG should keep working while the codebase stops assuming MTG is the whole app

## Existing Files To Refactor

Current shell-critical files:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/builder/page.tsx`
- `src/app/print/page.tsx`
- `src/store/deck-store.ts`
- `src/components/deck-builder/deck-builder-app.tsx`
- `src/components/deck-builder/print-sheet.tsx`

## Target Route Shape

Phase 1 target routes:
- `/`
- `/mtg`
- `/mtg/print`
- `/yugioh`
- `/yugioh/print`

Planned behavior:
- `/` becomes a lightweight launcher or route redirect
- `/mtg` becomes the current Commander builder
- `/mtg/print` becomes the current MTG print page
- `/yugioh` is a planned-product placeholder page
- `/yugioh/print` is a placeholder print route or hidden until Phase 7

## File-by-File Plan

### 1. `src/app/layout.tsx`
Change from:
- MTG-only metadata and no shared shell

Change to:
- shared site metadata
- shared header slot
- shared game switcher
- neutral site title and description

Recommended additions:
- `src/components/shell/app-header.tsx`
- `src/components/shell/game-switcher.tsx`

### 2. `src/app/page.tsx`
Change from:
- rendering the MTG builder directly

Change to:
- launcher page or redirect page

Recommended behavior:
- if a last-used game exists in app state, route there
- otherwise show a polished dual-product launcher with MTG and Yu-Gi-Oh cards

### 3. `src/app/mtg/page.tsx`
Create:
- new canonical MTG builder entry

This should contain the current logic from:
- `src/app/page.tsx`
- `src/app/builder/page.tsx`

### 4. `src/app/mtg/print/page.tsx`
Create:
- new canonical MTG print entry

This should contain the current print-page logic from:
- `src/app/print/page.tsx`

### 5. `src/app/yugioh/page.tsx`
Create:
- placeholder Yu-Gi-Oh product route

Phase 1 content should be simple:
- product overview
- "planned next" framing
- maybe a short roadmap teaser

This page should feel intentional, not empty.

### 6. `src/app/yugioh/print/page.tsx`
Create:
- placeholder route or hold until print work begins

If created in Phase 1, it should clearly state that the Yu-Gi-Oh print flow is planned but not yet shipped.

### 7. `src/store/deck-store.ts`
Change from:
- one MTG-specific store with a generic file name

Change to:
- `src/store/mtg-store.ts`

Then create:
- `src/store/app-store.ts`

Recommended `app-store.ts` responsibilities:
- active game
- last visited game
- shared UI preferences

### 8. MTG component names
Current:
- `src/components/deck-builder/deck-builder-app.tsx`
- `src/components/deck-builder/print-sheet.tsx`

Target:
- `src/components/mtg/deck-builder-app.tsx`
- `src/components/mtg/print-sheet.tsx`

This rename is not mandatory in Phase 1, but it is strongly recommended because the current folder name reads like the deck builder is global when it is not.

## Shared Shell Components

Recommended first shared components:

### `src/components/shell/app-header.tsx`
Responsibilities:
- site title
- top game switcher
- current section indicator
- maybe print/back actions if appropriate later

### `src/components/shell/game-switcher.tsx`
Responsibilities:
- clearly switch between MTG and Yu-Gi-Oh
- route-based selection state
- visually obvious active state

### `src/components/shared/card-preview-overlay.tsx`
Not required in Phase 1, but this should become the eventual home of the current preview overlay behavior so both games can reuse it.

## Shared Branding Update

Phase 1 should also update repository-facing copy from MTG-only branding to shared-site branding.

Recommended branding model:
- site brand: neutral
- MTG product name: `Commander Lab`
- Yu-Gi-Oh product name: `Duel Forge`

This keeps the site professional and avoids making Yu-Gi-Oh look bolted on later.

## Acceptance Criteria

Phase 1 is done when:

- MTG still works from `/mtg`
- MTG print still works from `/mtg/print`
- `/` no longer hardcodes MTG as the whole site
- a top game switcher exists
- the store names and route structure stop implying MTG is the only product
- the codebase has a clear place for Yu-Gi-Oh to land

## What Phase 1 Must Not Do

Do not:
- add Yu-Gi-Oh generator logic
- add YGOPRODeck clients
- add meta scraping
- add new deck heuristics
- mix Yu-Gi-Oh state into MTG store files

Phase 1 is a shell refactor, not a feature explosion.

## Suggested Commit Sequence

To keep the refactor clean, use small commits:

1. `Add shared shell and game switcher`
2. `Move MTG routes under /mtg`
3. `Split app and MTG stores`
4. `Add Yu-Gi-Oh placeholder route`
5. `Rename MTG-specific component folders`

## Recommended First Coding Ticket

If implementation starts immediately after this planning phase, the single best first ticket is:

- add `src/components/shell/app-header.tsx`
- add `src/components/shell/game-switcher.tsx`
- move MTG builder from `/` to `/mtg`
- turn `/` into a launcher page

That one ticket creates the product boundary the rest of the work depends on.
