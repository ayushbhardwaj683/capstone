interface ChartPoint {
  label: string;
  count: number;
}

interface ChartsProps {
  data?: ChartPoint[];
  badgeLabel?: string;
  title?: string;
  description?: string;
}

export function Charts({
  data = [],
  badgeLabel = "Live data",
  title = "Response Trend",
  description = "Submission activity from the backend analytics endpoint."
}: ChartsProps) {
  const points = data.length ? data.slice(-7) : [{ label: "No data", count: 0 }];
  const maxValue = Math.max(...points.map((point) => point.count), 1);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          {badgeLabel}
        </span>
      </div>
      <div className="mt-8 flex h-56 items-end gap-3 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_50%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-4">
        {points.map((point) => (
          <div key={`${point.label}-${point.count}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-sky-600 via-cyan-500 to-emerald-400 shadow-[0_12px_24px_rgba(6,182,212,0.22)]"
              style={{ height: `${Math.max((point.count / maxValue) * 180, point.count ? 24 : 8)}px` }}
            />
            <span className="text-center text-xs text-slate-500">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
