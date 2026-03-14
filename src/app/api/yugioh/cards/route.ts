import { NextRequest, NextResponse } from "next/server";

import { searchYugiohCards } from "@/lib/games/yugioh/ygoprodeck";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const archetype = request.nextUrl.searchParams.get("archetype")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ cards: [], sourceAudit: [] });
  }

  try {
    const response = await searchYugiohCards(query, archetype || undefined);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to search Yu-Gi-Oh cards." },
      { status: 500 },
    );
  }
}
