# Deck Generation

This document describes the deck-generation philosophy and the planned generator pipeline for the repository.

## Philosophy

The system should prioritize:

- structural logic
- synergy awareness
- consistency heuristics
- explainability

The generator should avoid both extremes:
- it should not be a naive pile of popular cards
- it should not be an opaque black box that cannot justify its choices

## Shared Principles

Across both games, the generator should:

- build around a clearly identified strategic anchor
- favor coherent structure over novelty for its own sake
- keep the user in control
- explain why recommendations were made
- avoid claiming live meta knowledge without explicit source data

## MTG Generation Snapshot

The current MTG product already follows a simplified version of this philosophy:
- commander or color identity anchors the build
- synergy and power presets influence the generated shell
- the deck can be tuned manually
- explanations and warnings are surfaced alongside the deck

That existing pattern is useful, but it should not be copied blindly into Yu-Gi-Oh because the deck-construction rules are fundamentally different.

## Yu-Gi-Oh Generation Model

The Yu-Gi-Oh side should use a multi-stage generator rather than one monolithic prompt.

### Stage 1: theme resolution
Inputs:
- theme name
- archetype
- boss monster
- featured support card

Outputs:
- resolved archetype identity
- nearby engines
- common package candidates
- canonical support pool

### Stage 2: corpus assembly
Inputs:
- selected theme
- selected build intent
- selected meta targets

Outputs:
- relevant public deck corpus
- inclusion frequencies
- common ratios
- common Extra Deck patterns
- candidate non-engine cards

This stage must preserve source URLs and fetch dates.

### Stage 3: role classification
Cards should be labeled into structural roles such as:
- starter
- extender
- searcher
- payoff
- hand trap
- board breaker
- engine requirement
- grind tool
- brick risk
- side-only option

These labels do not need to be perfect at first, but they must be explicit and inspectable.

### Stage 4: candidate construction
The constructor should assemble:
- Main Deck shell
- Extra Deck shell
- Side Deck shell

It should also identify:
- core engine
- flex slots
- tech slots

### Stage 5: structural scoring
Each candidate deck should be scored for:
- consistency
- synergy
- brick risk
- opener quality
- recovery
- interaction density
- anti-meta alignment
- internal conflicts

### Stage 6: explanation generation
Every generated list should produce explainable notes covering:
- why this engine size
- why these non-engine cards
- which matchups the list is trying to respect
- what the main weaknesses still are

## Structural Heuristics

The structural heuristics layer is the heart of the Yu-Gi-Oh product.

Examples of heuristic categories:
- starter density
- redundant access to engine pieces
- number of dead draws at common opener size
- ratio of proactive cards to reactive cards
- overlap or conflict in normal summon demands
- count of low-impact cards in bad matchups
- number of cards that require prior setup

The first version can use a weighted heuristic model rather than trying to solve deckbuilding perfectly.

## Dynamic Tuning Options

The app should not show the same static tuning controls for every theme.

Instead, the system should derive options from:
- the selected theme
- the generated deck structure
- the chosen build intent
- the current meta corpus

Example adaptive options:
- `more consistency`
- `higher ceiling`
- `fewer hand traps`
- `more board breakers`
- `purer theme`
- `more grind`
- `lower brick rate`
- `anti-meta rebuild`

Every rebuild action should also explain what changed.

## User Iteration Loop

The ideal loop is:
1. select theme and build intent
2. generate a strong shell
3. inspect explanations
4. apply smart rebuild options
5. manually tweak cards
6. re-evaluate the structure
7. print proxies

This means the generator should be designed for iteration, not just one-shot output.

## Anti-Hallucination Rule

The generator must not pretend to know current top decks unless it has a real corpus.

Allowed:
- `This package was recommended because it appears frequently in the current stored corpus for Yubel builds.`

Not allowed:
- `This is the best anti-meta package right now.` without a source-backed corpus.

## Future Advanced Systems

These should come after the MVP generator:
- opening-hand simulation
- combo line viewer
- matchup overlays
- card replacement reasoning
- import/export workflows

The MVP should first prove that it can generate coherent, explainable shells.
