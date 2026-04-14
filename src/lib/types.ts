export type IdeaStatus = "scratch" | "mature" | "archived";

export interface Competitor {
  name: string;
  description: string;
  strengths: string;
  weaknesses: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  targetRegion: string;
  targetAgeGroup: string;
  aiFeedback: string | null;
  competitors: Competitor[];
  gapAnalysis: string | null;
  archiveReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  ideas: Idea[];
}
