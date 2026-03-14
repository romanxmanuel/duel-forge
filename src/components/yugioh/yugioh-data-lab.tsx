"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useState } from "react";

import type { SourceAudit } from "@/lib/games/shared/types";
import type {
  YugiohArchetype,
  YugiohArchetypeSearchResponse,
  YugiohCard,
  YugiohCardSearchResponse,
} from "@/lib/games/yugioh/types";

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

export function YugiohDataLab() {
  const [archetypeQuery, setArchetypeQuery] = useState("");
  const [cardQuery, setCardQuery] = useState("");
  const deferredArchetypeQuery = useDeferredValue(archetypeQuery);
  const deferredCardQuery = useDeferredValue(cardQuery);
  const [selectedArchetype, setSelectedArchetype] = useState<YugiohArchetype | null>(null);
  const [archetypes, setArchetypes] = useState<YugiohArchetype[]>([]);
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [archetypeAudit, setArchetypeAudit] = useState<SourceAudit[]>([]);
  const [cardAudit, setCardAudit] = useState<SourceAudit[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showArchetypeResults = deferredArchetypeQuery.trim().length >= 2;
  const showCardResults = deferredCardQuery.trim().length >= 2;

  useEffect(() => {
    if (!showArchetypeResults) {
      return;
    }

    let isActive = true;

    fetchJson<YugiohArchetypeSearchResponse>(`/api/yugioh/archetypes?q=${encodeURIComponent(deferredArchetypeQuery)}`)
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
  }, [deferredArchetypeQuery, showArchetypeResults]);

  useEffect(() => {
    if (!showCardResults) {
      return;
    }

    let isActive = true;
    const params = new URLSearchParams({
      q: deferredCardQuery.trim(),
    });

    if (selectedArchetype) {
      params.set("archetype", selectedArchetype.name);
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
  }, [deferredCardQuery, selectedArchetype, showCardResults]);

  return (
    <main className="page-shell">
      <section className="hero-panel yugioh-data-hero">
        <div className="hero-copy">
          <p className="eyebrow">Yu-Gi-Oh Duel Forge</p>
          <h1>Search archetypes, inspect real card data, and lay the groundwork for Open Lab generation.</h1>
          <p className="hero-description">
            This phase adds a normalized YGOPRODeck-backed data layer so Yu-Gi-Oh can stop being a placeholder and
            start behaving like its own product. Archetype and card search now run through dedicated app routes with
            explicit source notes.
          </p>
          <div className="status-row">
            <span className="status-pill">YGOPRODeck-backed</span>
            <span className="status-pill">Archetype search live</span>
            <span className="status-pill">Card search live</span>
          </div>
        </div>

        <div className="panel yugioh-source-panel">
          <p className="panel-kicker">Current phase</p>
          <h2>Data foundation</h2>
          <p className="hero-description">
            The generator is still next. Right now the app is proving the Yu-Gi-Oh data model, source boundaries, and
            route structure before deck logic starts making claims.
          </p>
          <ul className="launcher-feature-list">
            <li>Normalized Yu-Gi-Oh card records</li>
            <li>Archetype discovery through the site API</li>
            <li>Route-safe source audit notes</li>
          </ul>
        </div>
      </section>

      <section className="dashboard-grid yugioh-dashboard-grid">
        <div className="panel control-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 1</p>
              <h2>Pick a theme</h2>
            </div>
          </div>

          <label className="field-label" htmlFor="yugioh-archetype-search">
            Search archetypes
          </label>
          <input
            id="yugioh-archetype-search"
            className="app-input"
            placeholder="Yubel, Sky Striker, Tenpai..."
            value={archetypeQuery}
            onChange={(event) => {
              setErrorMessage(null);
              const nextValue = event.target.value;
              setArchetypeQuery(nextValue);

              if (nextValue.trim().length < 2) {
                setArchetypes([]);
                setArchetypeAudit([]);
              }
            }}
          />

          {selectedArchetype ? (
            <div className="tag-row yugioh-selected-theme">
              <span className="tag-pill tag-pill-active">{selectedArchetype.name}</span>
              <button type="button" className="ghost-button" onClick={() => setSelectedArchetype(null)}>
                Clear theme
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
                    className="result-item yugioh-archetype-item"
                    onClick={() => setSelectedArchetype(archetype)}
                  >
                    <span>
                      <strong>{archetype.name}</strong>
                      <small>Use this as the theme anchor for Open Lab.</small>
                    </span>
                  </button>
                ))}
              </div>
              <SourceAuditBlock sourceAudit={archetypeAudit} />
            </>
          ) : null}
        </div>

        <div className="panel meta-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 2</p>
              <h2>Inspect card data</h2>
            </div>
          </div>

          <label className="field-label" htmlFor="yugioh-card-search">
            Search cards
          </label>
          <input
            id="yugioh-card-search"
            className="app-input"
            placeholder={selectedArchetype ? `Search within ${selectedArchetype.name}...` : "Search any Yu-Gi-Oh card..."}
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
              <div className="yugioh-card-grid">
                {cards.map((card) => (
                  <article key={card.id} className="summary-card yugioh-card-record">
                    {card.images.small ? (
                      <Image
                        src={card.images.small}
                        alt={card.name}
                        width={120}
                        height={175}
                        className="yugioh-card-thumb"
                        unoptimized
                      />
                    ) : null}
                    <div className="yugioh-card-copy">
                      <strong>{card.name}</strong>
                      <small>{card.typeLine}</small>
                      {card.archetype ? <span className="tag-pill">{card.archetype}</span> : null}
                      <p className="hero-description yugioh-card-description">{card.desc}</p>
                      <div className="yugioh-card-stats">
                        {card.attribute ? <span>Attribute: {card.attribute}</span> : null}
                        {card.race ? <span>Race: {card.race}</span> : null}
                        {card.levelRankLink ? <span>Level/Rank/Link: {card.levelRankLink}</span> : null}
                        {card.atk !== null ? <span>ATK: {card.atk}</span> : null}
                        {card.def !== null ? <span>DEF: {card.def}</span> : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <SourceAuditBlock sourceAudit={cardAudit} />
            </>
          ) : (
            <p className="empty-copy">
              Search for a theme and then inspect cards through the new Yu-Gi-Oh routes. Generator logic comes next
              once the data layer is proven.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
