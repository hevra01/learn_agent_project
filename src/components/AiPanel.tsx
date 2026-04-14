"use client";

import { useState } from "react";
import { Idea, Competitor } from "@/lib/types";
import CompetitorList from "./CompetitorList";

interface Props {
  idea: Idea;
  onUpdate: (updates: Partial<Idea>) => void;
}

export default function AiPanel({ idea, onUpdate }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(
    idea.aiFeedback ?? null
  );
  const [competitors, setCompetitors] = useState<Competitor[]>(
    idea.competitors ?? []
  );
  const [gapAnalysis, setGapAnalysis] = useState<string | null>(
    idea.gapAnalysis ?? null
  );
  const [researchAnalysis, setResearchAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFeedback() {
    setLoading("feedback");
    setError(null);
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId: idea.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback(data.feedback);
      onUpdate({ aiFeedback: data.feedback });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get feedback");
    } finally {
      setLoading(null);
    }
  }

  async function handleResearch() {
    setLoading("research");
    setError(null);
    try {
      const res = await fetch("/api/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId: idea.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResearchAnalysis(data.analysis);
      setCompetitors(data.competitors);
      setGapAnalysis(data.gapAnalysis);
      onUpdate({
        competitors: data.competitors,
        gapAnalysis: data.gapAnalysis,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to research competitors"
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">AI Assistant</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loading === "feedback"
            ? "Getting AI feedback... (this may take a minute)"
            : "Researching competitors... (this may take a couple minutes)"}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleFeedback}
          disabled={loading !== null}
          className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 disabled:opacity-50 transition-colors"
        >
          Get AI Feedback
        </button>
        <button
          onClick={handleResearch}
          disabled={loading !== null}
          className="px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm hover:bg-teal-100 disabled:opacity-50 transition-colors"
        >
          Research Competitors
        </button>
      </div>

      {feedback && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-purple-800 mb-2">
            AI Feedback
          </h3>
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {feedback}
          </div>
        </div>
      )}

      {researchAnalysis && (
        <div className="bg-teal-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-teal-800 mb-2">
            Market Analysis
          </h3>
          <p className="text-sm text-slate-700">{researchAnalysis}</p>
        </div>
      )}

      <CompetitorList competitors={competitors} />

      {gapAnalysis && (
        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">
            Gap Analysis & Differentiation
          </h3>
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {gapAnalysis}
          </div>
        </div>
      )}
    </div>
  );
}
