import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="launcher-hero">
        <div className="launcher-copy">
          <p className="eyebrow">Dual TCG Deck Lab</p>
          <h1>Choose your game, build smarter lists, and print clean playtest proxies.</h1>
          <p className="hero-description">
            Card Lab is evolving into a shared home for two separate deckbuilding products: Commander-first Magic and
            archetype-first Yu-Gi-Oh. Each game keeps its own logic, tuning flow, and print profile.
          </p>
          <div className="status-row">
            <span className="status-pill">MTG live now</span>
            <span className="status-pill">Yu-Gi-Oh shell next</span>
            <span className="status-pill">Proxy-print ready</span>
          </div>
        </div>

        <div className="launcher-grid">
          <Link href="/mtg" className="launcher-card launcher-card-mtg">
            <div className="launcher-card-copy">
              <p className="panel-kicker">Magic: The Gathering</p>
              <h2>Commander Lab</h2>
              <p>
                Build 100-card Commander shells, tune them with meta context, and print full proxy sheets for
                playtesting.
              </p>
            </div>
            <ul className="launcher-feature-list">
              <li>Commander-first workflow</li>
              <li>Meta-backed tuning</li>
              <li>Print-ready proxy sheets</li>
            </ul>
            <span className="launcher-card-cta">Open MTG builder</span>
          </Link>

          <Link href="/yugioh" className="launcher-card launcher-card-yugioh">
            <div className="launcher-card-copy">
              <p className="panel-kicker">Yu-Gi-Oh!</p>
              <h2>Duel Forge</h2>
              <p>
                Theme-first, anti-meta deck construction for archetypes like Yubel, Sky Striker, and Tenpai, with a
                future-facing print pipeline.
              </p>
            </div>
            <ul className="launcher-feature-list">
              <li>Open Lab mode</li>
              <li>Explainable structure scoring</li>
              <li>Archetype-aware tuning plan</li>
            </ul>
            <span className="launcher-card-cta">Explore Yu-Gi-Oh</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
