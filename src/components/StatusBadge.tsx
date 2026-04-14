import { IdeaStatus } from "@/lib/types";

const STYLES: Record<IdeaStatus, string> = {
  scratch: "bg-yellow-100 text-yellow-800",
  mature: "bg-green-100 text-green-800",
  archived: "bg-slate-100 text-slate-600",
};

const LABELS: Record<IdeaStatus, string> = {
  scratch: "Scratch",
  mature: "Mature",
  archived: "Archived",
};

export default function StatusBadge({ status }: { status: IdeaStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
