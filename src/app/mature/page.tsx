"use client";

import { useState, useEffect, useCallback } from "react";
import { Idea } from "@/lib/types";
import IdeaCard from "@/components/IdeaCard";

export default function MaturePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/ideas?status=mature");
    const data = await res.json();
    setIdeas(data);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  async function handleStatusChange(
    id: string,
    status: string,
    reason?: string
  ) {
    await fetch(`/api/ideas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        archiveReason: status === "archived" ? reason || "" : null,
      }),
    });
    fetchIdeas();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mature Ideas</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ideas that have been refined and are ready for development
        </p>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No mature ideas yet</p>
          <p className="text-sm mt-1">
            Promote ideas from the Scratch Area when they are ready
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
