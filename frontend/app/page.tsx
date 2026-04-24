
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

const highlights = [
  "Drag-and-drop builder with customizable fields",
  "Smart forms that adapt based on user answers",
  "Real-time analytics and easy data exports",
  "Secure sharing and team collaboration"
];

export default function HomePage() {
  return (
    <AppShell
      title="Create powerful, smart forms in minutes"
      subtitle=""
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-warm">Get Started</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Everything you need to collect and manage data effortlessly.</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" href="/forms/create">
              Start building
            </Link>
            <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700" href="/dashboard">
              View dashboard
            </Link>
            <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors" href="/register">
              Create an account
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-900 bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#0f766e_100%)] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Key Features</p>
          <ul className="mt-5 space-y-4 text-sm text-slate-200">
            {highlights.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
