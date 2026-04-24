interface StatCard {
  label: string;
  value: string;
  hint: string;
}

interface ResponseStatsProps {
  cards: StatCard[];
}

export function ResponseStats({ cards }: ResponseStatsProps) {

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />
          <p className="mt-4 text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
