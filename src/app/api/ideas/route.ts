import { NextRequest, NextResponse } from "next/server";
import { getAllIdeas, getIdeasByStatus, createIdea } from "@/lib/db";
import { IdeaStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") as IdeaStatus | null;
  const ideas = status ? getIdeasByStatus(status) : getAllIdeas();
  return NextResponse.json(ideas);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, targetRegion, targetAgeGroup } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  const idea = createIdea({
    title,
    description,
    targetRegion: targetRegion || "Worldwide",
    targetAgeGroup: targetAgeGroup || "General",
  });

  return NextResponse.json(idea, { status: 201 });
}
