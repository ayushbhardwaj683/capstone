"use client";

import { useState } from "react";
import type { FormInsight } from "@form-builder/shared";
import { generateFormInsightsRequest } from "@/lib/api";

interface AIInsightsPanelProps {
  formId: string;
  token: string;
  title?: string;
}

const sentimentTone = {
  positive: "bg-green-100 text-green-700",
  mixed: "bg-amber-100 text-amber-700",
  negative: "bg-red-100 text-red-700"
} as const;

export function AIInsightsPanel({ formId, token, title }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<FormInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateInsights() {
    setIsLoading(true);
    setError(null);

    try {
      const nextInsights = await generateFormInsightsRequest(formId, token);
      setInsights(nextInsights);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Failed to generate AI insights.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">AI Form Analyzer</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Generate AI Insights</h2>
          <p className="mt-2 text-sm text-slate-500">
            {title ? `Analyze feedback for ${title}.` : "Turn response data into a quick presentation-ready summary."}
          </p>
        </div>
        <button
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:opacity-60"
          disabled={isLoading}
          onClick={handleGenerateInsights}
          type="button"
        >
          {isLoading ? "Generating..." : "Generate AI Insights"}
        </button>
      </div>

      {error ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {insights ? (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${sentimentTone[insights.sentiment]}`}>
              {insights.sentiment} sentiment
            </span>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {insights.analyzedResponses} responses analyzed
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-ink">AI Summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{insights.summary}</p>
          </div>

          {insights.bulletPoints.length ? (
            <div>
              <p className="text-sm font-medium text-ink">Key insights</p>
              <div className="mt-3 space-y-2">
                {insights.bulletPoints.map((point) => (
                  <div key={point} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {insights.topCompliments.length ? (
            <div>
              <p className="text-sm font-medium text-ink">What users liked</p>
              <p className="mt-2 text-sm text-slate-600">{insights.topCompliments.join(", ")}.</p>
            </div>
          ) : null}

          {insights.topConcerns.length ? (
            <div>
              <p className="text-sm font-medium text-ink">Main concerns</p>
              <p className="mt-2 text-sm text-slate-600">{insights.topConcerns.join(", ")}.</p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-800">Recommended action</p>
            <p className="mt-2 text-sm text-orange-700">{insights.recommendation}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
