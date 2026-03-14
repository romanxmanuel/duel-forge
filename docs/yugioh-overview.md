# Yu-Gi-Oh Overview

This document defines the product vision for the Yu-Gi-Oh side of the site.

## Product Name

Working name:
- `Yu-Gi-Oh Duel Forge`

The name can change later, but the product intent should stay the same.

## Product Goal

Build the strongest structurally reasonable deck possible around a chosen theme, archetype, boss monster, or signature card package.

The Yu-Gi-Oh side is not intended to be:
- a generic legality checker
- a simple decklist archive
- a clone of the MTG Commander workflow

It is intended to be:
- archetype-first
- meta-aware
- explainable
- iteration-friendly
- proxy-print ready

## Primary Mode

The default Yu-Gi-Oh mode should be:
- `Open Lab`

Open Lab:
- ignores the official banlist by default
- still preserves structural deck logic
- still prefers sensible copy counts unless the user explicitly overrides them
- aims for the strongest version of the selected concept

This matches the product vision better than a tournament-legality-first mode.

## User Inputs

The first Yu-Gi-Oh release should accept these inputs:

- `theme`
  - example: `Yubel`
  - example: `Sky Striker`
  - example: `Tenpai Dragon`
- `build intent`
  - pure
  - hybrid
  - anti-meta
  - consistency-first
  - ceiling-first
  - blind second
  - grind
- `strength target`
  - casual
  - strong
  - tournament-level
  - degenerate
- `meta target`
  - current field
  - selected target decks
- `constraints`
  - fewer hand traps
  - limit traps
  - minimize bricks
  - avoid floodgates
  - pure-only
  - low Extra Deck reliance

## Deck Output

The generated output should include:

- `Main Deck`
- `Extra Deck`
- `Side Deck`
- explanation blocks
- role labels
- source-audit metadata

The deck should also expose:
- `core engine`
- `flex slots`
- `tech slots`

That separation matters because it makes iteration much easier.

## Smart Tuning System

The tuning system should not use one generic filter list for every archetype.

Instead, the app should produce dynamic options based on:
- the selected theme
- the chosen build intent
- the current source-backed meta corpus
- the deck's structural weaknesses

Examples of good archetype-aware tuning:

### Sky Striker
- spell-density bias
- going-second board-break package
- grind-heavy variant
- tighter hand trap count
- pure vs splash

### Yubel
- pure vs hybrid shell
- lower brick version
- stronger board-break package
- grindier recursion package

### Tenpai Dragon
- blind-second OTK bias
- anti-backrow package
- more gas, fewer reactive cards
- consistency-biased variant

## Explainability

Every generated Yu-Gi-Oh deck should explain:

- why the engine is this size
- why these non-engine cards were chosen
- what the deck is trying to beat
- what the main tradeoffs are
- what happens if the user applies a certain rebuild option

The system should also be able to answer:
- `Why is this card in the deck?`
- `What role does this card play?`
- `Why did the generator not include this other common card?`

## Structural Quality Bar

The Yu-Gi-Oh builder should understand enough game mechanics to produce structurally reasonable lists.

At minimum it should reason about:
- starters
- extenders
- searchers
- payoff cards
- hand traps
- board breakers
- engine size
- non-engine ratio
- normal summon conflicts
- brick risk
- Extra Deck dependence
- going-first vs going-second tension

## What Should Exceed Expectations

These are the features that can make the Yu-Gi-Oh side genuinely impressive:

- `Meta Hunt Mode`
  - build a list to pressure specific popular decks
- `Opening Hand Tester`
  - estimate how often the deck opens playable lines
- `Combo Line Viewer`
  - show common sequences and end states
- `Brick Meter`
  - quantify structural dead-draw risk
- `Variant Switcher`
  - rebuild the same theme across pure, hybrid, consistency-first, and anti-meta versions
- `Source Confidence`
  - show how much recent source evidence supports a recommendation

## Non-Goals For The First Release

Do not try to ship these on day one:
- full tournament legality engine
- multiple official format modes
- Master Duel support
- retro format support
- collection syncing
- pricing engine
- account system

The first version should focus on a compelling archetype-to-deck workflow.
