import { Competitor } from "@/lib/types";

interface Props {
  competitors: Competitor[];
}

export default function CompetitorList({ competitors }: Props) {
  if (competitors.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">Competitors</h3>
      {competitors.map((c, i) => (
        <div key={i} className="bg-slate-50 rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-slate-800">{c.name}</h4>
          <p className="text-slate-600 mt-1">{c.description}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs font-medium text-green-700">
                Strengths:
              </span>
              <p className="text-xs text-slate-600">{c.strengths}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-red-700">
                Weaknesses:
              </span>
              <p className="text-xs text-slate-600">{c.weaknesses}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
