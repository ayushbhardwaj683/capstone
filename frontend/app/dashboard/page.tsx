"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormListItem } from "@form-builder/shared";
import { AIInsightsPanel } from "@/components/analytics/AIInsightsPanel";
import { Charts } from "@/components/analytics/Charts";
import { ResponseStats } from "@/components/analytics/ResponseStats";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { getFormAnalyticsRequest, listFormsRequest } from "@/lib/api";

export default function DashboardPage() {
  const { isReady, token } = useAuth();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [chartData, setChartData] = useState<Array<{ label: string; count: number }>>([]);
  const [selectedInsightsFormId, setSelectedInsightsFormId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (token == null) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDashboard(authToken: string) {
      setIsLoading(true);
      setError(null);

      try {
        const nextForms = await listFormsRequest(authToken);
        const analytics = await Promise.all(nextForms.map((form) => getFormAnalyticsRequest(form.id, authToken).catch(() => null)));

        if (cancelled) {
          return;
        }

        const mergedTrend = new Map<string, number>();
        let nextTotalResponses = 0;

        analytics.forEach((entry) => {
          if (!entry) {
            return;
          }

          nextTotalResponses += entry.totalResponses;
          entry.responseTrend.forEach((point) => {
            mergedTrend.set(point.label, (mergedTrend.get(point.label) ?? 0) + point.count);
          });
        });

        setForms(nextForms);
        setSelectedInsightsFormId((current) => current || nextForms[0]?.id || "");
        setTotalResponses(nextTotalResponses);
        setChartData(Array.from(mergedTrend.entries()).map(([label, count]) => ({ label, count })));
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load the dashboard.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard(token);

    return () => {
      cancelled = true;
    };
  }, [isReady, token]);

  const publishedRate = forms.length ? `${Math.round((forms.filter((form) => form.isPublished).length / forms.length) * 100)}%` : "0%";
  const avgResponsesPerForm = forms.length ? (totalResponses / forms.length).toFixed(1) : "0.0";
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(search.toLowerCase()) || form.customSlug.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "published" ? form.isPublished : !form.isPublished);
    return matchesSearch && matchesFilter;
  });

  return (
    <AppShell title="Workspace dashboard" subtitle="A modern control center for templates, AI insights, response trends, and publishing health.">
      {!isReady || isLoading ? <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard...</div> : null}
      {isReady && !token ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Sign in to load your forms and analytics.</p>
          <Link className="mt-4 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" href="/login">
            Go to login
          </Link>
        </div>
      ) : null}
      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">{error}</div> : null}
      {isReady && token && !isLoading ? (
        <>
          <ResponseStats
            cards={[
              { label: "Responses", value: totalResponses.toString(), hint: "All submissions collected across your workspace." },
              { label: "Active Forms", value: forms.length.toString(), hint: "Published and draft forms available to manage." },
              { label: "Published Rate", value: publishedRate, hint: `Average ${avgResponsesPerForm} responses per form.` }
            ]}
          />
          {forms.length && selectedInsightsFormId ? (
            <div className="space-y-3">
              <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">AI insights demo</h2>
                    <p className="mt-1 text-sm text-slate-500">Pick a form and generate presentation-ready insights from its responses.</p>
                  </div>
                  <select
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                    onChange={(event) => setSelectedInsightsFormId(event.target.value)}
                    value={selectedInsightsFormId}
                  >
                    {forms.map((form) => (
                      <option key={form.id} value={form.id}>
                        {form.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <AIInsightsPanel
                formId={selectedInsightsFormId}
                token={token}
                title={forms.find((form) => form.id === selectedInsightsFormId)?.title}
              />
            </div>
          ) : null}
          <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-ink">Recent forms</h2>
                  <div className="flex flex-wrap gap-2">
                    <Link className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" href="/forms">
                      All Forms
                    </Link>
                    <button className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setFilter("all")} type="button">All</button>
                    <button className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === "published" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setFilter("published")} type="button">Published</button>
                    <button className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === "draft" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setFilter("draft")} type="button">Drafts</button>
                  </div>
                </div>
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-sky-400"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search forms by name or slug"
                  value={search}
                />
              </div>
              <div className="mt-5 space-y-3">
                {filteredForms.length ? (
                  filteredForms.map((form) => (
                    <div key={form.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-accent">
                      <Link className="min-w-0 flex-1" href={`/forms/${form.id}`}>
                        <p className="font-medium text-ink">{form.title}</p>
                        <p className="text-sm text-slate-500">/{form.customSlug}</p>
                      </Link>
                      <div className="ml-4 flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{form.isPublished ? "Published" : "Draft"}</span>
                        <Link className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600" href={`/forms/${form.id}/analytics`}>
                          View Analytics
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No forms matched your current search or filter.</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Charts
                data={chartData}
                badgeLabel="Backend analytics"
                title="Workspace response velocity"
                description="A cleaner daily aggregate of responses across all forms."
              />
              {selectedInsightsFormId ? (
                <div>
                  <Link className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white" href={`/forms/${selectedInsightsFormId}/analytics`}>
                    View Analytics
                  </Link>
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}
