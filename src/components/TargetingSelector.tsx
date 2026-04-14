"use client";

const REGIONS = [
  "Worldwide",
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Middle East & Africa",
  "United States",
  "India",
  "China",
  "Southeast Asia",
];

const AGE_GROUPS = [
  "General",
  "Under 18",
  "18-24",
  "25-34",
  "35-49",
  "50+",
];

interface Props {
  region: string;
  ageGroup: string;
  onRegionChange: (region: string) => void;
  onAgeGroupChange: (ageGroup: string) => void;
}

export default function TargetingSelector({
  region,
  ageGroup,
  onRegionChange,
  onAgeGroupChange,
}: Props) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Target Region
        </label>
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Target Age Group
        </label>
        <select
          value={ageGroup}
          onChange={(e) => onAgeGroupChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {AGE_GROUPS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
