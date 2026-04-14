"use client";

import Link from "next/link";
import { Idea } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  idea: Idea;
  onStatusChange?: (id: string, status: string, reason?: string) => void;
}

export default function IdeaCard({ idea, onStatusChange }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <Link
          href={`/idea/${idea.id}`}
          className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
        >
          {idea.title}
        </Link>
        <StatusBadge status={idea.status} />
      </div>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
        {idea.description}
      </p>
      <div className="flex gap-2 text-xs text-slate-500 mb-3">
        <span className="bg-slate-100 px-2 py-0.5 rounded">
          {idea.targetRegion}
        </span>
        <span className="bg-slate-100 px-2 py-0.5 rounded">
          {idea.targetAgeGroup}
        </span>
      </div>
      {idea.archiveReason && (
        <p className="text-xs text-slate-500 italic mb-3">
          Archived: {idea.archiveReason}
        </p>
      )}
      <div className="flex gap-2">
        <Link
          href={`/idea/${idea.id}`}
          className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          View Details
        </Link>
        {idea.status === "scratch" && onStatusChange && (
          <button
            onClick={() => onStatusChange(idea.id, "mature")}
            className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
          >
            Promote
          </button>
        )}
        {idea.status === "scratch" && onStatusChange && (
          <button
            onClick={() => {
              const reason = window.prompt("Why are you archiving this idea?");
              if (reason !== null) {
                onStatusChange(idea.id, "archived", reason);
              }
            }}
            className="text-xs px-3 py-1.5 bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            Archive
          </button>
        )}
        {idea.status === "archived" && onStatusChange && (
          <button
            onClick={() => onStatusChange(idea.id, "scratch")}
            className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors"
          >
            Restore to Scratch
          </button>
        )}
      </div>
    </div>
  );
}
