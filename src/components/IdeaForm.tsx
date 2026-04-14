"use client";

import { useState } from "react";
import TargetingSelector from "./TargetingSelector";

interface Props {
  onSubmit: (data: {
    title: string;
    description: string;
    targetRegion: string;
    targetAgeGroup: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    targetRegion: string;
    targetAgeGroup: string;
  };
}

export default function IdeaForm({ onSubmit, onCancel, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [region, setRegion] = useState(
    initialData?.targetRegion ?? "Worldwide"
  );
  const [ageGroup, setAgeGroup] = useState(
    initialData?.targetAgeGroup ?? "General"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      targetRegion: region,
      targetAgeGroup: ageGroup,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-lg p-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Pet Sitter Marketplace"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your software product idea..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          required
        />
      </div>
      <TargetingSelector
        region={region}
        ageGroup={ageGroup}
        onRegionChange={setRegion}
        onAgeGroupChange={setAgeGroup}
      />
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Idea
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
