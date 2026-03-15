import { NextResponse } from "next/server";
import { google } from "googleapis";

const CACHE_DURATION_SECONDS = 3600; // 1 Hour

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Youtube API Key is missing. Connect your Google Cloud account to enable live streaming." },
      { status: 500 }
    );
  }

  const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
  });

  try {
    // 1. First, search for ANY live streams surrounding "Yu-Gi-Oh Tournament"
    const liveResponse = await youtube.search.list({
      part: ["snippet"],
      q: "Yu-Gi-Oh Tournament",
      eventType: "live",
      type: ["video"],
      videoCategoryId: "20", // Gaming category
      maxResults: 1,
      order: "viewCount",
    });

    if (liveResponse.data.items && liveResponse.data.items.length > 0) {
      const bestLiveVideo = liveResponse.data.items[0];
      return NextResponse.json(
        { 
          videoId: bestLiveVideo.id?.videoId, 
          title: bestLiveVideo.snippet?.title, 
          channelId: bestLiveVideo.snippet?.channelId,
          channelTitle: bestLiveVideo.snippet?.channelTitle,
          isLive: true,
        },
        { headers: { "Cache-Control": `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${60 * 5}` } }
      );
    }

    // 2. Fallback: If no one is streaming a tournament right now, grab the most recent high-view-count VOD
    const fallbackResponse = await youtube.search.list({
      part: ["snippet"],
      q: "Yu-Gi-Oh Master Duel WCS Finals",
      type: ["video"],
      maxResults: 1,
      order: "relevance",
    });

    const fallbackVideo = fallbackResponse.data.items?.[0] || null;

    if (!fallbackVideo) {
       throw new Error("Could not find any fallback VODs from Youtube.");
    }

    return NextResponse.json(
      { 
        videoId: fallbackVideo.id?.videoId, 
        title: fallbackVideo.snippet?.title, 
        channelId: fallbackVideo.snippet?.channelId,
        channelTitle: fallbackVideo.snippet?.channelTitle,
        isLive: false,
      },
      { headers: { "Cache-Control": `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${60 * 5}` } }
    );

  } catch (error) {
    console.error("Youtube API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
