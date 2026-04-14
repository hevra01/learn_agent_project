import { NextRequest, NextResponse } from "next/server";
import { getIdeaById, updateIdea } from "@/lib/db";
import { generateFeedback } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { ideaId } = await request.json();
  const idea = getIdeaById(ideaId);
  if (!idea) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  try {
    const feedback = await generateFeedback(idea);
    updateIdea(ideaId, { aiFeedback: feedback });
    return NextResponse.json({ feedback });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI call failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
