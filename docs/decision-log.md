# Decision Log

This document records the key architectural and product decisions so the repository keeps a readable design history.

## 2026-03-13

### Decision: one website, two separate products
Decision:
- keep MTG and Yu-Gi-Oh under one site shell
- treat them as separate products, not one shared deck builder

Why:
- shared branding is useful
- game logic is too different to unify at the product layer

### Decision: route split instead of query-parameter switching
Decision:
- use `/mtg` and `/yugioh` routes

Why:
- cleaner architecture
- easier state boundaries
- better employer-facing repo shape

### Decision: Yu-Gi-Oh default mode is `Open Lab`
Decision:
- Yu-Gi-Oh primary mode ignores the banlist by default

Why:
- product goal is strongest structurally sound theme build, not legality-first validation

### Decision: no fake meta knowledge
Decision:
- the app may only claim meta awareness when it has an explicit source-backed corpus

Why:
- trust matters more than sounding smart

### Decision: shared shell, separate domains
Decision:
- share navigation, preview, and print primitives
- keep separate game stores, types, and generators

Why:
- keeps code professional and maintainable

### Decision: print system is a first-class subsystem
Decision:
- proxy printing is not an afterthought

Why:
- playtesting is core to the product value
- print sizing and image handling create real engineering requirements

### Decision: shell refactor before Yu-Gi-Oh generator logic
Decision:
- Phase 1 focuses on routes, shell, and store split

Why:
- prevents Yu-Gi-Oh from being bolted onto MTG architecture

## How To Use This File

Add entries when:
- a major architectural choice is made
- a source strategy changes
- a print strategy changes
- a product-scope boundary is added or removed

Keep entries short and practical.
