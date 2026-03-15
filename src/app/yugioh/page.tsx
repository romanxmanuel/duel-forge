"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useDeferredValue } from "react";
import type { YugiohCard } from "@/lib/games/yugioh/types";

type HoverPreviewCard = {
  name: string;
  typeLine: string;
  image: string;
};

type LiveStreamData = {
  videoId: string;
  title: string;
  channelTitle: string;
  isLive: boolean;
};

const GLOW_MAP: Record<number, string> = {
  46986414: "glow-purple",
  89631139: "glow-blue",
  14558127: "glow-orange",
  86066372: "glow-blue",
  27204311: "glow-orange",
  90448279: "glow-grey"
};

export default function YugiohDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<YugiohCard[]>([]);
  const [featuredCards, setFeaturedCards] = useState<YugiohCard[]>([]);
  const [hoverPreviewCard, setHoverPreviewCard] = useState<HoverPreviewCard | null>(null);
  const [liveStream, setLiveStream] = useState<LiveStreamData | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState(true);

  useEffect(() => {
    let isActive = true;
    if (deferredSearchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    fetch(`/api/yugioh/cards?q=${encodeURIComponent(deferredSearchQuery.trim())}`)
      .then(res => res.json())
      .then(data => {
        if (isActive && data.cards) {
          setSearchResults(data.cards.slice(0, 10)); // Limit to top 10 results for dropdown
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isActive) {
          setIsSearching(false);
        }
      });

    return () => { isActive = false; };
  }, [deferredSearchQuery]);

  // Fetch Featured Cards
  useEffect(() => {
    fetch('/api/yugioh/featured')
      .then(res => res.json())
      .then(data => {
        if (data.cards) setFeaturedCards(data.cards);
      })
      .catch(err => console.error("Failed to load featured cards:", err));
  }, []);

  // Fetch Live Stream Data
  useEffect(() => {
    setIsLoadingStream(true);
    fetch('/api/yugioh/live')
      .then(res => res.json())
      .then(data => {
        if (data.videoId) setLiveStream(data as LiveStreamData);
      })
      .catch(err => console.error("Failed to load live stream:", err))
      .finally(() => setIsLoadingStream(false));
  }, []);

  const activePreviewCard = hoverPreviewCard;

  return (
    <div className="ygo-dashboard-layout">
      <div className="ygo-top-row">
        {/* Welcome Banner */}
        <div className="ygo-welcome-panel">
          <div className="ygo-welcome-copy">
            <h1>Welcome, Yugi!</h1>
            <p>(Rank S | Platinum)</p>
          </div>
          {/* Decorative element, standard image placeholder logic */}
          <div style={{ position: "absolute", right: "-10%", bottom: "-20%", width: "220px", height: "220px", opacity: 0.8, backgroundImage: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)" }} />
          <svg style={{ position: "absolute", right: "1rem", bottom: "0", opacity: 0.6 }} width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="url(#gradient-purple)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
            <circle cx="12" cy="12" r="5" />
          </svg>
        </div>

        {/* Search Panel */}
        <div className="ygo-search-panel">
          <div className="ygo-section-header">
            <h2>Search Cards</h2>
          </div>
          <div className="ygo-search-input-wrapper">
            <svg className="ygo-search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              className="ygo-search-input" 
              placeholder="Search 15,000+ Cards..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Search Dropdown */}
            {(searchQuery.length > 0 && (searchResults.length > 0 || isSearching)) && (
              <div className="ygo-search-dropdown">
                {isSearching ? (
                  <div style={{ padding: "1rem", color: "#94a3b8", textAlign: "center", fontSize: "0.9rem" }}>
                    Searching network...
                  </div>
                ) : (
                  searchResults.map(card => (
                    <div 
                      key={card.id} 
                      className="ygo-search-result-item"
                    >
                      <img 
                        src={card.images.crop || card.images.small || ""} 
                        alt="" 
                        className="ygo-search-result-thumb" 
                        loading="lazy" 
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoverPreviewCard({
                          name: card.name,
                          typeLine: card.typeLine,
                          image: card.images.full || card.images.small || ""
                        })}
                        onMouseLeave={() => setHoverPreviewCard(null)}
                      />
                      <div className="ygo-search-result-copy">
                        <strong>{card.name}</strong>
                        <small>{card.typeLine}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="ygo-search-filters">
            <div className="ygo-filter-chip">
              Filters <svg style={{display: 'inline', marginLeft: '2px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="ygo-filter-chip">
              Recent <svg style={{display: 'inline', marginLeft: '2px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cards */}
      <div>
        <div className="ygo-section-header">
          <h2>Featured & Hot Cards</h2>
          <Link href="/yugioh/builder" className="ygo-section-action">+ New Deck</Link>
        </div>
        
        <div className="ygo-featured-cards">
          {featuredCards.length > 0 ? featuredCards.map(card => {
            const glowClass = GLOW_MAP[card.id] || "glow-blue";
            return (
              <div 
                key={card.id} 
                className="ygo-card-showcase"
                onMouseEnter={() => setHoverPreviewCard({
                  name: card.name,
                  typeLine: card.typeLine,
                  image: card.images.full || card.images.small || ""
                })}
                onMouseLeave={() => setHoverPreviewCard(null)}
              >
                <div className={`ygo-card-image-wrapper ${glowClass}`}>
                  <img src={card.images.full || card.images.small || ""} alt={card.name} width={150} height={219} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.style.background = '#3b82f6'; e.currentTarget.parentElement!.style.height = '219px'; e.currentTarget.parentElement!.style.display = 'grid'; e.currentTarget.parentElement!.style.placeItems = 'center'; e.currentTarget.parentElement!.innerHTML = '<span style="color:white;text-align:center;padding:10px;font-size:12px;">Image Missing</span>'; }} />
                </div>
                <div className="ygo-card-showcase-copy">
                  <strong>{card.name}</strong>
                  <small>{card.atk !== null ? `${card.atk} ATK` : "Spell/Trap"}</small>
                </div>
              </div>
            );
          }) : (
            <div style={{ color: "#94a3b8", padding: "1rem" }}>Loading featured cards...</div>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="ygo-bottom-grid">
        
        {/* Active Live Duel */}
        <div className="ygo-live-duel-panel">
          <div className="ygo-live-duel-header">
            <h2>
              {liveStream?.isLive ? "Active Duels " : "Recent Tournaments "}
              <span style={{color: '#94a3b8', fontSize: '1rem', fontWeight: 'normal'}}>
                ({liveStream?.isLive ? "Live" : "VOD"})
              </span>
            </h2>
            {liveStream?.isLive ? (
              <div className="ygo-live-badge">Live</div>
            ) : null}
          </div>

          <div style={{ aspectRatio: '16/9', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a' }}>
            {isLoadingStream ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Connecting to YouTube...
              </div>
            ) : liveStream ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${liveStream.videoId}?autoplay=0`} 
                title={liveStream.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                Unable to load stream. Please check API Key.
              </div>
            )}
          </div>
          
          {liveStream && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontWeight: '500', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {liveStream.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Streaming via {liveStream.channelTitle}
              </div>
            </div>
          )}
        </div>

        {/* Side Stack */}
        <div className="ygo-side-stack">
          {/* My Decks */}
          <div className="ygo-list-panel">
            <div className="ygo-section-header">
              <h2>My Decks</h2>
            </div>
            
            <div className="ygo-deck-list">
              <div className="ygo-deck-item">
                <div className="ygo-deck-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z"></path></svg>
                </div>
                <div className="ygo-deck-item-copy" style={{flex: 1}}>
                  <strong>Dark Magician Beatdown</strong>
                </div>
                <div style={{color: '#64748b', fontSize: '0.85rem'}}>(40)</div>
              </div>

              <div className="ygo-deck-item">
                <div className="ygo-deck-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <div className="ygo-deck-item-copy" style={{flex: 1}}>
                  <strong>Sky Striker Control</strong>
                </div>
                <div style={{color: '#64748b', fontSize: '0.85rem'}}>(40)</div>
              </div>
            </div>
            
            <Link href="/yugioh/builder" style={{textDecoration: 'none'}}>
              <button className="ygo-new-deck-btn">+ New Deck</button>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="ygo-list-panel">
            <div className="ygo-section-header">
              <h2>Recent Activity</h2>
            </div>
            
            <div className="ygo-activity-list">
              <div className="ygo-activity-item">
                <div className="ygo-activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div className="ygo-activity-copy">
                  <strong>Card Search</strong>
                  <small>11 minutes ago</small>
                </div>
              </div>

              <div className="ygo-activity-item">
                <div className="ygo-activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </div>
                <div className="ygo-activity-copy">
                  <strong>Deck Edited</strong>
                  <small>2 minutes ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {activePreviewCard?.image ? (
        <div className="deck-preview-overlay" aria-hidden="true" style={{ zIndex: 100 }}>
          <div className="deck-preview-scrim" />
          <div className="deck-preview-frame">
            <Image
              src={activePreviewCard.image}
              alt={activePreviewCard.name}
              width={488}
              height={680}
              className="deck-preview-image"
              unoptimized
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
