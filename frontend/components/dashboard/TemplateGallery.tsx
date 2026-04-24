"use client";

import Link from "next/link";
import { BadgeCheck, BriefcaseBusiness, ChartColumnBig, GraduationCap, LibraryBig, Sparkles, Users } from "lucide-react";
import { formTemplates } from "@/lib/form-templates";

const iconMap = {
  Sparkles,
  GraduationCap,
  LibraryBig,
  BriefcaseBusiness,
  BadgeCheck,
  ChartColumnBig,
  Users
} as const;

const accentMap: Record<string, string> = {
  party: "linear-gradient(135deg,#fb7185 0%,#fb923c 55%,#fde68a 100%)",
  school: "linear-gradient(135deg,#06b6d4 0%,#22d3ee 55%,#dbeafe 100%)",
  college: "linear-gradient(135deg,#8b5cf6 0%,#6366f1 55%,#7dd3fc 100%)",
  office: "linear-gradient(135deg,#334155 0%,#475569 45%,#22d3ee 100%)",
  jobs: "linear-gradient(135deg,#10b981 0%,#2dd4bf 55%,#bef264 100%)",
  survey: "linear-gradient(135deg,#d946ef 0%,#fb7185 55%,#fdba74 100%)",
  "technical-interview": "linear-gradient(135deg,#0f172a 0%,#2563eb 50%,#38bdf8 100%)",
  "hr-interview": "linear-gradient(135deg,#7c3aed 0%,#8b5cf6 45%,#c4b5fd 100%)",
  "internship-application": "linear-gradient(135deg,#0f766e 0%,#14b8a6 45%,#67e8f9 100%)",
  "freelancer-hiring": "linear-gradient(135deg,#374151 0%,#f97316 55%,#fdba74 100%)",
  csat: "linear-gradient(135deg,#ec4899 0%,#fb7185 55%,#fdba74 100%)",
  "employee-engagement": "linear-gradient(135deg,#1d4ed8 0%,#06b6d4 55%,#a5f3fc 100%)",
  "user-research": "linear-gradient(135deg,#7c2d12 0%,#ea580c 45%,#fdba74 100%)",
  "startup-pitch": "linear-gradient(135deg,#581c87 0%,#d946ef 45%,#f9a8d4 100%)"
};

interface TemplateGalleryProps {
  showStartFromScratch?: boolean;
}

export function TemplateGallery({ showStartFromScratch = true }: TemplateGalleryProps) {
  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Quick Start Templates</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Start with a ready-made form</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Party, school, college, office, hiring, and survey templates are ready so users can create forms faster like in Google Forms, but with a more polished SaaS workflow.</p>
        </div>
        {showStartFromScratch ? (
          <Link className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" href="/forms/create">
            Start from scratch
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {formTemplates.map((template) => {
          const Icon = iconMap[template.icon as keyof typeof iconMap] ?? Sparkles;

          return (
            <Link
              key={template.id}
              href={`/forms/create?template=${template.id}`}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
            >
              <div
                className="relative h-32 overflow-hidden p-5 text-white"
                style={{
                  background: accentMap[template.id] ?? "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)"
                }}
              >
                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-md" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.12)_100%)]" />
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">{template.category}</span>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-8">
                  <p className="max-w-[16rem] text-lg font-semibold tracking-tight leading-tight">{template.title}</p>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm leading-6 text-slate-600">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>{template.fields.length} starter questions</span>
                  <span className="text-sky-700 transition group-hover:translate-x-1">Use template</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
