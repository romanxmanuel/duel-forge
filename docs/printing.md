# Printing

This document describes the printing and proxy workflow for both games.

## Printing Goals

The print system exists for personal playtesting only.

It should prioritize:
- correct card dimensions
- clean print layout
- easy cutting
- optional calibration page
- PDF-friendly export

## Shared Printing Strategy

The print subsystem should be shared at the shell level and game-specific at the profile level.

Shared responsibilities:
- print page structure
- print-friendly CSS
- calibration helpers
- cut-guide layout
- page density logic
- browser print workflow

Game-specific responsibilities:
- card dimensions
- image sourcing
- placeholder styling
- layout density tuning

## Current MTG Printing

The current MTG print flow already supports:
- full-card images
- cut-ready sheet rendering
- browser print workflow

Target MTG proxy profile:
- `63 mm x 88 mm`
- approximately `2.5 in x 3.5 in`

This profile should remain intact when the repository is split into `/mtg` and `/yugioh`.

## Planned Yu-Gi-Oh Printing

Yu-Gi-Oh needs its own print profile.

Planned target:
- Japanese-size card profile
- approximately `59 mm x 86 mm`

Important note:
- this should be treated as a target profile that must be confirmed by a calibration print before the feature is declared final

Because browser print and printer margins vary, calibration is not optional if the goal is true-size playtest proxies.

## Layout Strategy

Recommended print layout goals:
- maximize sheet density without making cuts frustrating
- maintain consistent gutters
- allow a clean crop around each card
- preserve full-card readability

Recommended v1 approach:
- browser print layout
- PDF-friendly CSS
- optional cut guides

Recommended v2 approach:
- add a generated PDF export only if browser PDF output proves insufficient

## Calibration System

The printing system should include an optional calibration page.

Calibration page goals:
- print a test rectangle or calibration card frame
- let the user measure width and height
- show pass/fail guidance
- store the selected profile in local preferences if needed later

This is especially important for Yu-Gi-Oh because its card size differs from MTG.

## Image Strategy

### MTG
- continue using Scryfall images
- prefer full-card images for print

### Yu-Gi-Oh
- use YGOPRODeck image references initially
- do not rely on permanent hotlinking for production printing
- cache or re-host print-quality images before treating the system as stable

This matters because YGOPRODeck explicitly warns clients not to repeatedly hotlink their image assets.

## PDF Export Strategy

Recommended staged approach:

### Stage 1
- rely on browser print dialog
- encourage `Save as PDF`
- optimize page CSS for predictable layout

### Stage 2
- if needed, generate dedicated PDFs server-side or in a client-safe export flow

The initial version should stay lightweight and Vercel-friendly.

## Open Questions To Validate During Implementation

- exact optimal page density for Yu-Gi-Oh cards
- whether cut guides should be optional or always on
- whether users need art-only, text-light, or full-card proxy variants
- whether cached print assets should expire automatically
