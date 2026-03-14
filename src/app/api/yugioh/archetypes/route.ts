import { NextRequest, NextResponse } from "next/server";

import { searchYugiohArchetypes } from "@/lib/games/yugioh/ygoprodeck";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ archetypes: [], sourceAudit: [] });
  }

  try {
    const response = await searchYugiohArchetypes(query);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to search archetypes." },
      { status: 500 },
    );
  }
}
