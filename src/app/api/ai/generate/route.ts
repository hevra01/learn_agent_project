import { NextRequest, NextResponse } from "next/server";
import { generateIdeas } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { targetRegion, targetAgeGroup } = await request.json();

  try {
    const ideas = await generateIdeas(
      targetRegion || "Worldwide",
      targetAgeGroup || "General"
    );
    return NextResponse.json({ ideas });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI call failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
