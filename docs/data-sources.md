# Data Sources

This repository is moving toward a dual-product structure:

- `MTG Commander Lab`
- `Yu-Gi-Oh Duel Forge`

The two games should share a site shell, not a data model. This document defines which sources the system should trust, how each source is used, and where the boundaries are between canonical card data, official rules, and community meta intelligence.

## Source Trust Model

Use a layered trust model instead of pretending every source is equally authoritative.

1. `Canonical card data`
   Exact card records, names, rules text, images, and searchable metadata.
2. `Official rules and format reference`
   Rulebooks, format definitions, and other official wording.
3. `Community meta corpus`
   Public decklists, trend signals, and archetype usage patterns.
4. `Local derived intelligence`
   Role labels, structural scoring, build notes, and recommendations computed by this app.

The application should never present community trends as official fact, and it should never present model memory as live meta knowledge.

## MTG Sources

### 1. Scryfall
- Role: canonical MTG card database
- Use:
  - card search
  - legality checks
  - oracle text
  - card images
  - commander enrichment
  - print-sheet images
- Why it is primary:
  - rich, well-structured API
  - strong image coverage
  - legality fields built into card objects
  - stable fit for a lightweight serverless app

Reference:
- <https://scryfall.com/docs/api>

### 2. EDHREC
- Role: Commander meta and recommendation enrichment
- Use:
  - theme tags
  - commander popularity
  - common inclusions
  - average deck-shape context
- Notes:
  - treat EDHREC as a Commander-specific recommendation layer, not a canonical rules source

References:
- <https://edhrec.com/commanders>
- <https://json.edhrec.com/pages/commanders/atraxa-praetors-voice.json>

### 3. Commander Spellbook
- Role: combo and pressure intelligence
- Use:
  - combo-aware signals
  - bracket estimation
  - sharp-pattern detection
- Notes:
  - this is an intelligence layer, not the canonical card record source

References:
- <https://backend.commanderspellbook.com/>
- <https://commanderspellbook.com/about/>

### 4. Wizards of the Coast
- Role: official MTG rules and format copy
- Use:
  - official Commander wording
  - official banned-list copy
  - help and format pages

References:
- <https://magic.wizards.com/en/formats/commander>
- <https://magic.wizards.com/en/banned-restricted-list>

## Yu-Gi-Oh Sources

### 1. YGOPRODeck
- Role: primary Yu-Gi-Oh card and archetype database
- Use:
  - card search
  - archetype lookup
  - image references
  - full-card print assets
  - recent public deck pages for meta ingestion
- Why it is the best starting point:
  - free public API
  - full-card, small, and cropped images
  - archetype-aware filtering
  - broad modern card coverage

Important engineering caveat:
- YGOPRODeck explicitly warns against repeatedly hotlinking images and recommends downloading and re-hosting them locally.
- For this repo, that means thumbnails may begin as remote references during prototyping, but print-quality images should be cached or re-hosted before the Yu-Gi-Oh print system is treated as production-ready.

Important rate-limit caveat:
- The current API guide says the API is rate-limited to `20 requests per second`, and clients are expected to store pulled data locally rather than repeatedly hitting the API.

References:
- <https://ygoprodeck.com/api-guide/>
- Example recent deck pages:
  - <https://ygoprodeck.com/deck/yubel-599113>
  - <https://ygoprodeck.com/deck/sky-striker-tcg-686485>
  - <https://ygoprodeck.com/deck/sky-striker-mar-2026-v2-697598>
  - <https://ygoprodeck.com/deck/tenpai-dragon-ruler-jan-2026-tcg-format-678402>

### 2. Official Yu-Gi-Oh Rulebook
- Role: official rules reference
- Use:
  - deck construction rules
  - terminology
  - general rules wording
- Important current note:
  - the rulebook is useful for core deck structure and gameplay wording, but product logic should not depend on it for live meta knowledge

References:
- <https://www.yugioh-card.com/en/rulebook/>
- Rulebook PDF discovered during research:
  - <https://img.yugioh-card.com/en/downloads/rulebook/SD_RuleBook_EN_10.pdf>

### 3. Official Yu-Gi-Oh Card Database / Neuron
- Role: official card lookup and deck recipe reference
- Use:
  - official card verification
  - official naming sanity checks
  - optional future deck recipe enrichment
- Notes:
  - useful as a verification and reference surface
  - not as convenient as YGOPRODeck for a lightweight app-first data client

References:
- <https://www.db.yugioh-card.com/yugiohdb/>
- <https://www.db.yugioh-card.com/yugiohdb/card_search>

### 4. Meta Corpus Sources
- Role: public trend and deck-construction corpus
- Initial plan:
  - recent YGOPRODeck public deck pages
  - recent YGOPRODeck archetype pages
  - recent YGOPRODeck top-archetype pages
- Future optional expansion:
  - official public deck recipes from Neuron where practical
  - separate `Master Duel` corpus if that format is added later

Important product rule:
- The app should not say it "knows the meta" unless the recommendation is backed by an explicit stored corpus snapshot with source URLs and timestamps.

## Source-Audit Requirements

Every recommendation engine should preserve a source audit trail.

Suggested minimum audit fields:
- `sourceName`
- `sourceType`
- `sourceUrl`
- `fetchedAt`
- `game`
- `formatMode`
- `confidence`
- `notes`

The UI should surface freshness for any Yu-Gi-Oh meta-dependent recommendation.

## Storage Strategy

### Runtime
- keep browser payloads small
- fetch through server routes
- cache aggressively
- avoid pushing giant source datasets to the client

### Near-term local snapshotting
- MTG:
  - continue live server-side fetches with revalidation
- Yu-Gi-Oh:
  - snapshot key YGOPRODeck card and meta data into a lightweight local cache
  - cache or re-host print-quality images

### Longer-term option
- move shared snapshots into SQLite or libSQL/Turso if cross-device sync or recurring ingestion becomes important

## What This Repo Must Not Do

- It must not pretend a stale deck corpus is current.
- It must not claim official support for a community source.
- It must not present scraped meta conclusions without a visible source boundary.
- It must not assume remote image hosts are safe forever for print-quality workflows.
