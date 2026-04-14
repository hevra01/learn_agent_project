import { NextRequest, NextResponse } from "next/server";
import { getIdeaById, updateIdea } from "@/lib/db";
import { researchCompetitors, brainstormGaps } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { ideaId } = await request.json();
  const idea = getIdeaById(ideaId);
  if (!idea) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  try {
    const { analysis, competitors } = await researchCompetitors(idea);
    updateIdea(ideaId, { competitors });

    let gapAnalysis: string | null = null;
    if (competitors.length > 0) {
      gapAnalysis = await brainstormGaps(idea, competitors);
      updateIdea(ideaId, { gapAnalysis });
    }

    return NextResponse.json({ analysis, competitors, gapAnalysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI call failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
