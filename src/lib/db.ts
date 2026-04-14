import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Database, Idea, IdeaStatus } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "ideas.json");

function readDb(): Database {
  if (!fs.existsSync(DB_PATH)) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify({ ideas: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getAllIdeas(): Idea[] {
  return readDb().ideas;
}

export function getIdeasByStatus(status: IdeaStatus): Idea[] {
  return readDb().ideas.filter((i) => i.status === status);
}

export function getIdeaById(id: string): Idea | null {
  return readDb().ideas.find((i) => i.id === id) ?? null;
}

export function createIdea(data: {
  title: string;
  description: string;
  targetRegion: string;
  targetAgeGroup: string;
}): Idea {
  const db = readDb();
  const now = new Date().toISOString();
  const idea: Idea = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    status: "scratch",
    targetRegion: data.targetRegion,
    targetAgeGroup: data.targetAgeGroup,
    aiFeedback: null,
    competitors: [],
    gapAnalysis: null,
    archiveReason: null,
    createdAt: now,
    updatedAt: now,
  };
  db.ideas.push(idea);
  writeDb(db);
  return idea;
}

export function updateIdea(id: string, data: Partial<Idea>): Idea | null {
  const db = readDb();
  const index = db.ideas.findIndex((i) => i.id === id);
  if (index === -1) return null;
  const updated = {
    ...db.ideas[index],
    ...data,
    id: db.ideas[index].id, // prevent id override
    createdAt: db.ideas[index].createdAt, // prevent createdAt override
    updatedAt: new Date().toISOString(),
  };
  db.ideas[index] = updated;
  writeDb(db);
  return updated;
}

export function deleteIdea(id: string): boolean {
  const db = readDb();
  const index = db.ideas.findIndex((i) => i.id === id);
  if (index === -1) return false;
  db.ideas.splice(index, 1);
  writeDb(db);
  return true;
}
