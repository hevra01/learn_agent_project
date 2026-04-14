"use client";

import { useState, useEffect, useCallback } from "react";
import { Idea } from "@/lib/types";
import IdeaCard from "@/components/IdeaCard";

export default function ArchivePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/ideas?status=archived");
    const data = await res.json();
    setIdeas(data);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/ideas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, archiveReason: null }),
    });
    fetchIdeas();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Archive</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ideas you decided not to pursue, with notes on why
        </p>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No archived ideas</p>
          <p className="text-sm mt-1">
            Archived ideas with their reasons will appear here
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
