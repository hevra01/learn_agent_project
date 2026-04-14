"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Idea } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import AiPanel from "@/components/AiPanel";

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ideas/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.push("/scratch");
          return;
        }
        setIdea(data);
        setTitle(data.title);
        setDescription(data.description);
        setLoading(false);
      });
  }, [id, router]);

  async function handleSave() {
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const updated = await res.json();
    setIdea(updated);
    setEditing(false);
  }

  async function handleStatusChange(status: string, reason?: string) {
    const body: Record<string, unknown> = { status };
    if (status === "archived") {
      body.archiveReason = reason || "";
    } else {
      body.archiveReason = null;
    }
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const updated = await res.json();
    setIdea(updated);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this idea permanently?")) return;
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    router.push("/scratch");
  }

  function handleAiUpdate(updates: Partial<Idea>) {
    if (idea) {
      setIdea({ ...idea, ...updates });
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400">Loading...</div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-16 text-slate-400">Idea not found</div>
    );
  }

  return (
    <div className="max-w-5xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        &larr; Back
      </button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Idea details */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              {editing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold text-slate-900 border-b border-blue-300 focus:outline-none focus:border-blue-500 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-slate-900">
                  {idea.title}
                </h1>
              )}
              <StatusBadge status={idea.status} />
            </div>

            {editing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
            ) : (
              <p className="text-slate-600 whitespace-pre-wrap">
                {idea.description}
              </p>
            )}

            <div className="flex gap-2 mt-4 text-sm text-slate-500">
              <span className="bg-slate-100 px-2 py-1 rounded">
                {idea.targetRegion}
              </span>
              <span className="bg-slate-100 px-2 py-1 rounded">
                {idea.targetAgeGroup}
              </span>
            </div>

            {editing ? (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setTitle(idea.title);
                    setDescription(idea.description);
                    setEditing(false);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            )}
          </div>

          {/* Status actions */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex gap-2">
            {idea.status !== "mature" && (
              <button
                onClick={() => handleStatusChange("mature")}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm"
              >
                Promote to Mature
              </button>
            )}
            {idea.status !== "archived" && (
              <button
                onClick={() => {
                  const reason = window.prompt(
                    "Why are you archiving this idea?"
                  );
                  if (reason !== null) handleStatusChange("archived", reason);
                }}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 text-sm"
              >
                Archive
              </button>
            )}
            {idea.status !== "scratch" && (
              <button
                onClick={() => handleStatusChange("scratch")}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 text-sm"
              >
                Move to Scratch
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm ml-auto"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Right: AI panel */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <AiPanel idea={idea} onUpdate={handleAiUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
