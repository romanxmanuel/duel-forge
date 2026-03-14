# Risk Register

This document captures the main architectural and product risks before implementation begins.

## Highest Risks

### 1. Mixed product boundaries
Risk:
- Yu-Gi-Oh gets bolted onto MTG-specific structure

Why it matters:
- confusing repo
- brittle state management
- employer-unfriendly architecture

Mitigation:
- route split first
- store split first
- domain folder split first

### 2. Fake meta confidence
Risk:
- app sounds smarter than its source data really is

Why it matters:
- product trust collapses
- recommendations become hard to defend

Mitigation:
- source-audit model
- freshness state
- confidence labels
- no unsupported claims

### 3. Image hosting fragility
Risk:
- relying forever on remote hotlinked print assets

Why it matters:
- broken print flow
- performance instability
- source-provider friction

Mitigation:
- explicit image cache plan
- separate print asset strategy
- do not treat hotlinked images as permanent

### 4. Overcomplicated first release
Risk:
- trying to ship generator, simulator, combo viewer, meta corpus, and printing all at once

Why it matters:
- slows everything down
- increases refactor cost

Mitigation:
- strict phased roadmap
- shell first
- data layer second
- generator MVP before advanced intelligence

### 5. Weak explainability
Risk:
- deck lists feel arbitrary

Why it matters:
- users cannot trust or iterate intelligently

Mitigation:
- explanation blocks
- role labels
- core / flex / tech grouping
- score movement explanations

## Medium Risks

### 6. Shared abstractions too early
Risk:
- forcing MTG and Yu-Gi-Oh into one generic deck model

Mitigation:
- keep shared types minimal
- preserve separate game domains

### 7. Print dimensions not validated physically
Risk:
- proxies look correct on screen but print incorrectly

Mitigation:
- calibration page
- explicit print profiles
- physical validation before claiming true-size support

### 8. Source drift
Risk:
- YGOPRODeck page structure or source patterns change

Mitigation:
- keep ingestion logic isolated
- store normalized snapshots
- preserve source URLs and fetch timestamps

## Low-but-Real Risks

### 9. Documentation drift
Risk:
- code diverges from the planning package

Mitigation:
- update docs at each phase boundary
- keep README honest about shipped vs planned work

### 10. Terminology leakage
Risk:
- Commander language appears inside Yu-Gi-Oh flows or vice versa

Mitigation:
- separate naming conventions
- separate product components
- review shared UI copy carefully

## Risk Review Cadence

Recommended checkpoints:
- after Phase 1 shell split
- after Yu-Gi-Oh data layer
- after generator MVP
- before print release

This register should stay lightweight, but it should be revisited as the product becomes more real.
