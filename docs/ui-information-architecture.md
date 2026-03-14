# UI Information Architecture

This document defines the planned information architecture for the dual-product site.

## Site Model

The website should present one brand with two clearly separate game products:

- `MTG Commander Lab`
- `Yu-Gi-Oh Duel Forge`

The top switcher should make this feel like one polished home for both communities, not one game bolted onto the other.

## Global Navigation

Recommended persistent header:
- site logo / brand
- game switcher
- current page title or breadcrumb
- optional print/back actions when contextually useful

Recommended switcher labels:
- `Magic: The Gathering`
- `Yu-Gi-Oh!`

The active game should always be visually obvious.

## Route-Level IA

### `/`
Purpose:
- launcher
- game choice
- shared brand entry point

Content:
- concise product statement
- two strong game cards
- current status of each product

### `/mtg`
Purpose:
- MTG Commander builder

Primary zones:
- deck inputs
- meta/explanation panel
- deck shell and tuning panel

### `/mtg/print`
Purpose:
- MTG proxy printing

Primary zones:
- print toolbar
- calibration notes if needed later
- print sheet

### `/yugioh`
Purpose:
- Yu-Gi-Oh deck forge

Primary zones for the eventual builder:
- theme and intent input
- source-backed meta panel
- generated Main / Extra / Side sections
- explanation and scoring panel
- smart rebuild options

### `/yugioh/print`
Purpose:
- Yu-Gi-Oh proxy printing

Primary zones:
- print toolbar
- calibration toggle
- print sheet

## Yu-Gi-Oh Builder Layout

The Yu-Gi-Oh page should not copy the MTG Commander layout one-for-one.

Recommended top-level sections:

### 1. Build Setup
- theme or archetype search
- build intent
- strength target
- meta target
- constraints

### 2. Meta Snapshot
- source freshness
- confidence level
- common packages
- common threats

### 3. Deck Output
- Main Deck
- Extra Deck
- Side Deck

### 4. Explanation + Scores
- score cards
- explanation blocks
- core / flex / tech grouping

### 5. Smart Rebuilds
- more consistency
- anti-meta rebuild
- lower brick version
- purer theme

## MTG Builder Layout

The MTG side can keep its current broad layout pattern, but it should move under MTG-specific naming and routes.

The important IA rule is:
- shared shell, separate product logic

## Preview Behavior

The preview system should be shared, but the card semantics remain game-specific.

Shared:
- hover or focus preview overlay
- print-safe full-card preview style

Game-specific:
- card image source
- fallback placeholder
- print profile

## Explanation IA

Both games should surface explanations, but the explanation blocks should reflect each game's logic.

### MTG explanation style
- commander synergy
- combo pressure
- bracket notes

### Yu-Gi-Oh explanation style
- engine rationale
- starter and extender logic
- matchup respect
- brick and consistency tradeoffs

## UX Guardrails

Do not:
- mix MTG and Yu-Gi-Oh terms in shared labels
- show Yu-Gi-Oh legal/banlist controls by default if Open Lab is the primary mode
- hide source freshness for meta-dependent Yu-Gi-Oh recommendations
- overload the first Yu-Gi-Oh release with too many modes

The first release should feel clean, deliberate, and easy to iterate in.
