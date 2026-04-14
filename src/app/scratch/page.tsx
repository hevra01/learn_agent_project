"use client";

import { useState, useEffect, useCallback } from "react";
import { Idea } from "@/lib/types";
import IdeaCard from "@/components/IdeaCard";
import IdeaForm from "@/components/IdeaForm";
import TargetingSelector from "@/components/TargetingSelector";

export default function ScratchPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genRegion, setGenRegion] = useState("Worldwide");
  const [genAgeGroup, setGenAgeGroup] = useState("General");
  const [generating, setGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<
    { title: string; description: string }[]
  >([]);
  const [genError, setGenError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/ideas?status=scratch");
    const data = await res.json();
    setIdeas(data);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  async function handleCreateIdea(data: {
    title: string;
    description: string;
    targetRegion: string;
    targetAgeGroup: string;
  }) {
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchIdeas();
  }

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

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    setGeneratedIdeas([]);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRegion: genRegion,
          targetAgeGroup: genAgeGroup,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedIdeas(data.ideas);
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Failed to generate ideas"
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handlePickGenerated(idea: {
    title: string;
    description: string;
  }) {
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...idea,
        targetRegion: genRegion,
        targetAgeGroup: genAgeGroup,
      }),
    });
    setGeneratedIdeas([]);
    setShowGenerate(false);
    fetchIdeas();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scratch Area</h1>
          <p className="text-sm text-slate-500 mt-1">
            Develop and explore new ideas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setShowGenerate(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Idea
          </button>
          <button
            onClick={() => {
              setShowGenerate(!showGenerate);
              setShowForm(false);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            AI Generate Ideas
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <IdeaForm
            onSubmit={handleCreateIdea}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {showGenerate && (
        <div className="mb-6 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Generate Ideas with AI
          </h2>
          <p className="text-sm text-slate-500">
            Select your target market and let AI suggest product ideas.
          </p>
          <TargetingSelector
            region={genRegion}
            ageGroup={genAgeGroup}
            onRegionChange={setGenRegion}
            onAgeGroupChange={setGenAgeGroup}
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating... (this may take a minute)" : "Generate"}
          </button>
          {genError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {genError}
            </div>
          )}
          {generatedIdeas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">
                AI Suggestions - click to save:
              </h3>
              {generatedIdeas.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => handlePickGenerated(idea)}
                  className="w-full text-left bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors"
                >
                  <h4 className="font-semibold text-purple-800">
                    {idea.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {idea.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {ideas.length === 0 && !showForm && !showGenerate ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No scratch ideas yet</p>
          <p className="text-sm mt-1">
            Create a new idea or let AI generate some for you
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
