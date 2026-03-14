"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import type { SourceAudit } from "@/lib/games/shared/types";
import {
  createStructuralReadout,
  inferDeckSection,
  YUGIOH_CONSTRAINT_OPTIONS,
  YUGIOH_FORMAT_OPTIONS,
  YUGIOH_INTENT_OPTIONS,
  YUGIOH_STRENGTH_OPTIONS,
} from "@/lib/games/yugioh/builder-shell";
import type {
  YugiohArchetype,
  YugiohArchetypeSearchResponse,
  YugiohCard,
  YugiohCardRole,
  YugiohCardSearchResponse,
  YugiohDeckEntry,
  YugiohDeckSection,
} from "@/lib/games/yugioh/types";
import { useYugiohStore } from "@/store/yugioh-store";

type HoverPreviewCard = {
  name: string;
  image: string;
};

async function fetchJson<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Request failed.");
  }

  return (await response.json()) as T;
}

function SourceAuditBlock({ sourceAudit }: { sourceAudit: SourceAudit[] }) {
  if (sourceAudit.length === 0) {
    return null;
  }

  return (
    <div className="yugioh-source-block">
      {sourceAudit.map((entry) => (
        <div key={`${entry.sourceName}-${entry.sourceUrl}`} className="yugioh-source-row">
          <strong>{entry.sourceName}</strong>
          <small>{entry.notes}</small>
        </div>
      ))}
    </div>
  );
}

function roleLabel(role: YugiohCardRole) {
  switch (role) {
    case "engine-core":
      return "Engine Core";
    case "engine-support":
      return "Engine Support";
    case "hand-trap":
      return "Hand Trap";
    case "board-breaker":
      return "Board Breaker";
    case "grind-tool":
      return "Grind Tool";
    case "brick-risk":
      return "Brick Risk";
    case "side-tech":
      return "Side Tech";
    case "extra-toolbox":
      return "Extra Toolbox";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

function countCopies(entries: YugiohDeckEntry[]) {
  return entries.reduce((total, entry) => total + entry.quantity, 0);
}

type DeckSectionPanelProps = {
  entries: YugiohDeckEntry[];
  title: string;
  section: YugiohDeckSection;
  onHoverCard: (card: HoverPreviewCard | null) => void;
};

function DeckSectionPanel({ entries, title, section, onHoverCard }: DeckSectionPanelProps) {
  const decrementCard = useYugiohStore((state) => state.decrementCard);
  const removeCard = useYugiohStore((state) => state.removeCard);

  return (
    <div className="yugioh-deck-group">
      <div className="deck-group-header">
        <h3>{title}</h3>
        <span>{countCopies(entries)}</span>
      </div>

      {entries.length > 0 ? (
        <div className="deck-rows">
          {entries.map((entry) => (
            <div key={`${section}-${entry.card.id}`} className="deck-row yugioh-deck-row">
              <div className="deck-row-copy">
                <span className="yugioh-quantity-badge">{entry.quantity}x</span>
                <div
                  className="deck-row-thumb-trigger"
                  onMouseEnter={() =>
                    entry.card.images.full
                      ? onHoverCard({
                          name: entry.card.name,
                          image: entry.card.images.full,
                        })
                      : null
                  }
                  onMouseLeave={() => onHoverCard(null)}
                >
                  {entry.card.images.small ? (
                    <Image
                      src={entry.card.images.small}
                      alt={entry.card.name}
                      width={80}
                      height={112}
                      className="deck-row-thumb"
                      unoptimized
                    />
                  ) : (
                    <div className="deck-row-thumb deck-row-thumb-placeholder" />
                  )}
                </div>
                <div>
                  <span>{entry.card.name}</span>
                  <small>{entry.card.typeLine}</small>
                  {entry.roles.length > 0 ? (
                    <div className="tag-row yugioh-role-row">
                      {entry.roles.slice(0, 3).map((role) => (
                        <span key={`${entry.card.id}-${role}`} className="tag-pill">
                          {roleLabel(role)}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="yugioh-row-actions">
                <button type="button" className="ghost-button" onClick={() => decrementCard(entry.card.id, section)}>
                  -1
                </button>
                <button type="button" className="danger-link" onClick={() => removeCard(entry.card.id, section)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-copy">No cards in this section yet.</p>
      )}
    </div>
  );
}

export function YugiohBuilderApp() {
  const {
    formatMode,
    strengthTarget,
    buildIntent,
    theme,
    constraints,
    main,
    extra,
    side,
    setFormatMode,
    setStrengthTarget,
    setBuildIntent,
    setThemeQuery,
    setResolvedArchetype,
    toggleBossCard,
    toggleConstraint,
    addCard,
    clearDeck,
    clearAll,
  } = useYugiohStore();

  const themeQuery = theme?.query ?? "";
  const deferredThemeQuery = useDeferredValue(themeQuery);
  const [cardQuery, setCardQuery] = useState("");
  const deferredCardQuery = useDeferredValue(cardQuery);
  const [archetypes, setArchetypes] = useState<YugiohArchetype[]>([]);
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [archetypeAudit, setArchetypeAudit] = useState<SourceAudit[]>([]);
  const [cardAudit, setCardAudit] = useState<SourceAudit[]>([]);
  const [activeAddSection, setActiveAddSection] = useState<YugiohDeckSection>("main");
  const [hoverPreviewCard, setHoverPreviewCard] = useState<HoverPreviewCard | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showArchetypeResults = deferredThemeQuery.trim().length >= 2;
  const showCardResults = deferredCardQuery.trim().length >= 2;

  useEffect(() => {
    if (!showArchetypeResults) {
      return;
    }

    let isActive = true;

    fetchJson<YugiohArchetypeSearchResponse>(`/api/yugioh/archetypes?q=${encodeURIComponent(deferredThemeQuery)}`)
      .then((payload) => {
        if (!isActive) {
          return;
        }

        setArchetypes(payload.archetypes);
        setArchetypeAudit(payload.sourceAudit);
      })
      .catch((error: Error) => {
        if (isActive) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      isActive = false;
    };
  }, [deferredThemeQuery, showArchetypeResults]);

  useEffect(() => {
    if (!showCardResults) {
      return;
    }

    let isActive = true;
    const params = new URLSearchParams({
      q: deferredCardQuery.trim(),
    });

    if (theme?.resolvedArchetype) {
      params.set("archetype", theme.resolvedArchetype);
    }

    fetchJson<YugiohCardSearchResponse>(`/api/yugioh/cards?${params.toString()}`)
      .then((payload) => {
        if (!isActive) {
          return;
        }

        setCards(payload.cards);
        setCardAudit(payload.sourceAudit);
      })
      .catch((error: Error) => {
        if (isActive) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      isActive = false;
    };
  }, [deferredCardQuery, showCardResults, theme?.resolvedArchetype]);

  const structuralReadout = useMemo(
    () =>
      createStructuralReadout({
        main,
        extra,
        side,
        theme,
        buildIntent,
        strengthTarget,
        constraints,
      }),
    [buildIntent, constraints, extra, main, side, strengthTarget, theme],
  );

  const themeSummary = useMemo(() => {
    return {
      mainCount: countCopies(main),
      extraCount: countCopies(extra),
      sideCount: countCopies(side),
      bossCards: theme?.resolvedBossCards ?? [],
    };
  }, [extra, main, side, theme?.resolvedBossCards]);

  function selectArchetype(archetype: YugiohArchetype) {
    setErrorMessage(null);
    setResolvedArchetype(archetype.name);
  }

  function handleAddCard(card: YugiohCard) {
    setErrorMessage(null);
    addCard(card, activeAddSection);
  }

  return (
    <main className="page-shell">
      <section className="hero-panel yugioh-builder-hero">
        <div className="hero-copy">
          <p className="eyebrow">Yu-Gi-Oh Duel Forge</p>
          <h1>Shape a real shell now, then let the generator get nastier in the next phase.</h1>
          <p className="hero-description">
            The Yu-Gi-Oh side now has its own persisted builder shell: pick a theme, choose the posture, manually seed
            Main, Extra, and Side cards, and get a structural read without pretending we already have full generator
            intelligence.
          </p>
          <div className="status-row">
            <span className="status-pill">Open Lab ready</span>
            <span className="status-pill">Theme-first</span>
            <span className="status-pill">Main / Extra / Side</span>
          </div>
        </div>

        <div className="panel yugioh-hero-summary">
          <p className="panel-kicker">Current shell</p>
          <h2>{theme?.resolvedArchetype ?? themeSummary.bossCards[0] ?? "No theme locked yet"}</h2>
          <p className="hero-description">
            {theme?.resolvedArchetype
              ? `The workbench is scoped to ${theme.resolvedArchetype} right now.`
              : "Pick an archetype, a boss card, or both. The builder will keep that focus visible as you tune."}
          </p>
          <div className="summary-grid">
            <div className="summary-card">
              <span>Main</span>
              <strong>{themeSummary.mainCount}</strong>
            </div>
            <div className="summary-card">
              <span>Extra</span>
              <strong>{themeSummary.extraCount}</strong>
            </div>
            <div className="summary-card">
              <span>Side</span>
              <strong>{themeSummary.sideCount}</strong>
            </div>
            <div className="summary-card">
              <span>Structural read</span>
              <strong>{structuralReadout.finalScore}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid yugioh-builder-grid">
        <div className="panel control-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 1</p>
              <h2>Theme anchor</h2>
            </div>
            <button type="button" className="ghost-button" onClick={clearAll}>
              Reset all
            </button>
          </div>

          <label className="field-label" htmlFor="yugioh-theme-search">
            Theme or archetype
          </label>
          <input
            id="yugioh-theme-search"
            className="app-input"
            placeholder="Yubel, Sky Striker, Tenpai..."
            value={themeQuery}
            onChange={(event) => {
              setErrorMessage(null);
              const nextValue = event.target.value;
              setThemeQuery(nextValue);

              if (nextValue.trim().length < 2) {
                setArchetypes([]);
                setArchetypeAudit([]);
              }
            }}
          />

          {theme?.resolvedArchetype || (theme?.resolvedBossCards.length ?? 0) > 0 ? (
            <div className="tag-row yugioh-selected-theme">
              {theme?.resolvedArchetype ? <span className="tag-pill tag-pill-active">{theme.resolvedArchetype}</span> : null}
              {(theme?.resolvedBossCards ?? []).map((cardName) => (
                <span key={cardName} className="tag-pill">
                  {cardName}
                </span>
              ))}
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setResolvedArchetype(null);
                  setThemeQuery("");
                }}
              >
                Clear theme text
              </button>
            </div>
          ) : null}

          {showArchetypeResults && archetypes.length > 0 ? (
            <>
              <div className="result-list">
                {archetypes.map((archetype) => (
                  <button
                    key={archetype.id}
                    type="button"
                    className={`result-item yugioh-archetype-item ${
                      theme?.resolvedArchetype === archetype.name ? "result-item-active" : ""
                    }`}
                    onClick={() => selectArchetype(archetype)}
                  >
                    <span>
                      <strong>{archetype.name}</strong>
                      <small>Use this as the current engine shell.</small>
                    </span>
                  </button>
                ))}
              </div>
              <SourceAuditBlock sourceAudit={archetypeAudit} />
            </>
          ) : (
            <p className="empty-copy">
              Search an archetype first. Boss monsters can be pinned from card search results in the deck workbench.
            </p>
          )}

          <div className="meta-block">
            <h4>Format posture</h4>
            <div className="power-grid yugioh-option-grid">
              {YUGIOH_FORMAT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`power-card ${formatMode === option.value ? "power-card-active" : ""}`}
                  onClick={() => setFormatMode(option.value)}
                >
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="panel meta-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 2</p>
              <h2>Build posture</h2>
            </div>
            <button type="button" className="ghost-button" onClick={clearDeck}>
              Clear deck
            </button>
          </div>

          <label className="field-label">Strength target</label>
          <div className="power-grid yugioh-option-grid">
            {YUGIOH_STRENGTH_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`power-card ${strengthTarget === option.value ? "power-card-active" : ""}`}
                onClick={() => setStrengthTarget(option.value)}
              >
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </button>
            ))}
          </div>

          <label className="field-label">Build intent</label>
          <div className="power-grid yugioh-option-grid">
            {YUGIOH_INTENT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`power-card ${buildIntent === option.value ? "power-card-active" : ""}`}
                onClick={() => setBuildIntent(option.value)}
              >
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </button>
            ))}
          </div>

          <label className="field-label">Constraints</label>
          <div className="tag-row">
            {YUGIOH_CONSTRAINT_OPTIONS.map((constraint) => (
              <button
                key={constraint.value}
                type="button"
                className={`tag-pill ${constraints.includes(constraint.value) ? "tag-pill-active" : ""}`}
                onClick={() => toggleConstraint(constraint.value)}
                title={constraint.description}
              >
                {constraint.title}
              </button>
            ))}
          </div>

          <div className="meta-block">
            <h4>Structural read</h4>
            <div className="summary-grid">
              <div className="summary-card">
                <span>Consistency</span>
                <strong>{structuralReadout.consistency}</strong>
              </div>
              <div className="summary-card">
                <span>Synergy</span>
                <strong>{structuralReadout.synergy}</strong>
              </div>
              <div className="summary-card">
                <span>Pressure</span>
                <strong>{structuralReadout.pressure}</strong>
              </div>
              <div className="summary-card">
                <span>Adaptability</span>
                <strong>{structuralReadout.adaptability}</strong>
              </div>
              <div className="summary-card">
                <span>Integrity</span>
                <strong>{structuralReadout.structuralIntegrity}</strong>
              </div>
              <div className="summary-card">
                <span>Overall</span>
                <strong>{structuralReadout.finalScore}</strong>
              </div>
            </div>

            {structuralReadout.warnings.length > 0 ? (
              <div className="warning-box">
                {structuralReadout.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            ) : null}

            <ul className="meta-list">
              {structuralReadout.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel deck-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 3</p>
              <h2>Deck workbench</h2>
            </div>
            <Link href="/yugioh/print" className="ghost-button">
              Print roadmap
            </Link>
          </div>

          <label className="field-label">Target section</label>
          <div className="tag-row">
            {(["main", "extra", "side"] as YugiohDeckSection[]).map((section) => (
              <button
                key={section}
                type="button"
                className={`tag-pill ${activeAddSection === section ? "tag-pill-active" : ""}`}
                onClick={() => setActiveAddSection(section)}
              >
                {section === "main" ? "Main Deck" : section === "extra" ? "Extra Deck" : "Side Deck"}
              </button>
            ))}
          </div>

          <label className="field-label" htmlFor="yugioh-card-search">
            Search cards
          </label>
          <input
            id="yugioh-card-search"
            className="app-input"
            placeholder={
              theme?.resolvedArchetype
                ? `Search within ${theme.resolvedArchetype}...`
                : "Search any Yu-Gi-Oh card to seed the shell..."
            }
            value={cardQuery}
            onChange={(event) => {
              setErrorMessage(null);
              const nextValue = event.target.value;
              setCardQuery(nextValue);

              if (nextValue.trim().length < 2) {
                setCards([]);
                setCardAudit([]);
              }
            }}
          />

          {errorMessage ? <p className="error-copy">{errorMessage}</p> : null}

          {showCardResults && cards.length > 0 ? (
            <>
              <div className="yugioh-card-result-grid">
                {cards.map((card) => {
                  const suggestedSection = inferDeckSection(card);

                  return (
                    <article key={card.id} className="summary-card yugioh-card-result">
                      <div className="yugioh-card-result-media">
                        <div
                          className="deck-row-thumb-trigger"
                          onMouseEnter={() =>
                            card.images.full
                              ? setHoverPreviewCard({
                                  name: card.name,
                                  image: card.images.full,
                                })
                              : null
                          }
                          onMouseLeave={() => setHoverPreviewCard(null)}
                        >
                          {card.images.small ? (
                            <Image
                              src={card.images.small}
                              alt={card.name}
                              width={96}
                              height={140}
                              className="yugioh-card-thumb"
                              unoptimized
                            />
                          ) : (
                            <div className="yugioh-card-thumb" />
                          )}
                        </div>
                      </div>
                      <div className="yugioh-card-copy">
                        <strong>{card.name}</strong>
                        <small>{card.typeLine}</small>
                        <div className="tag-row">
                          {card.archetype ? <span className="tag-pill">{card.archetype}</span> : null}
                          <span className="tag-pill">Suggest: {suggestedSection}</span>
                        </div>
                        <p className="hero-description yugioh-card-description">{card.desc}</p>
                        <div className="yugioh-card-stats">
                          {card.attribute ? <span>Attribute: {card.attribute}</span> : null}
                          {card.race ? <span>Race: {card.race}</span> : null}
                          {card.levelRankLink ? <span>Level/Rank/Link: {card.levelRankLink}</span> : null}
                          {card.atk !== null ? <span>ATK: {card.atk}</span> : null}
                          {card.def !== null ? <span>DEF: {card.def}</span> : null}
                        </div>
                        <div className="yugioh-card-actions">
                          <button type="button" className="primary-button" onClick={() => handleAddCard(card)}>
                            Add to {activeAddSection}
                          </button>
                          <button type="button" className="ghost-button" onClick={() => toggleBossCard(card)}>
                            {(theme?.resolvedBossCards ?? []).includes(card.name) ? "Unpin boss" : "Use as boss"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <SourceAuditBlock sourceAudit={cardAudit} />
            </>
          ) : (
            <p className="empty-copy">
              Search cards and start pinning boss monsters or seeding the shell manually while the full generator is
              still ahead of us.
            </p>
          )}

          <div className="yugioh-deck-shell">
            <DeckSectionPanel entries={main} title="Main Deck" section="main" onHoverCard={setHoverPreviewCard} />
            <DeckSectionPanel entries={extra} title="Extra Deck" section="extra" onHoverCard={setHoverPreviewCard} />
            <DeckSectionPanel entries={side} title="Side Deck" section="side" onHoverCard={setHoverPreviewCard} />
          </div>
        </div>
      </section>

      {hoverPreviewCard?.image ? (
        <div className="deck-preview-overlay" aria-hidden="true">
          <div className="deck-preview-scrim" />
          <div className="deck-preview-frame">
            <Image
              src={hoverPreviewCard.image}
              alt={hoverPreviewCard.name}
              width={488}
              height={680}
              className="deck-preview-image"
              unoptimized
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
