import Link from "next/link";

export default function YugiohPage() {
  return (
    <main className="page-shell">
      <section className="launcher-hero yugioh-hero">
        <div className="launcher-copy">
          <p className="eyebrow">Yu-Gi-Oh Duel Forge</p>
          <h1>Archetype-first, explainable deckbuilding is the next major product on this site.</h1>
          <p className="hero-description">
            Phase 1 gives Yu-Gi-Oh a real route and product boundary. The next implementation phases add archetype
            search, Open Lab generation, structural scoring, and print-ready proxies.
          </p>
          <div className="status-row">
            <span className="status-pill">Open Lab planned</span>
            <span className="status-pill">Theme-first generation</span>
            <span className="status-pill">Proxy workflow planned</span>
          </div>
        </div>

        <div className="yugioh-panel-grid">
          <article className="panel yugioh-placeholder-panel">
            <p className="panel-kicker">Planned first</p>
            <h2>What ships next</h2>
            <ul className="launcher-feature-list">
              <li>Theme and archetype search</li>
              <li>Main, Extra, and Side deck shell generation</li>
              <li>Structural scoring with explanations</li>
              <li>Print-ready Yu-Gi-Oh proxy sheets</li>
            </ul>
          </article>

          <article className="panel yugioh-placeholder-panel">
            <p className="panel-kicker">While we build</p>
            <h2>Current live product</h2>
            <p className="hero-description">
              The MTG Commander Lab is live today and already supports generation, tuning, and proxy printing.
            </p>
            <Link href="/mtg" className="ghost-button">
              Open MTG Commander Lab
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
