"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { FormAnalytics, FormResponse, FormSchema } from "@form-builder/shared";
import { AIInsightsPanel } from "@/components/analytics/AIInsightsPanel";
import { BreakdownBoard } from "@/components/analytics/BreakdownBoard";
import { Charts } from "@/components/analytics/Charts";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { getFormAnalyticsRequest, getFormRequest, getFormResponsesRequest } from "@/lib/api";

export default function ResponsesPage() {
  const params = useParams<{ formId: string }>();
  const formId = String(params.formId);
  const { isReady, token } = useAuth();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [activeView, setActiveView] = useState<"trend" | "breakdown" | "responses">("trend");
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

    async function loadResponses(authToken: string) {
      setIsLoading(true);
      setError(null);

      try {
        const [nextForm, nextAnalytics, nextResponses] = await Promise.all([
          getFormRequest(formId, authToken),
          getFormAnalyticsRequest(formId, authToken),
          getFormResponsesRequest(formId, authToken)
        ]);

        if (cancelled) {
          return;
        }

        setForm(nextForm);
        setAnalytics(nextAnalytics);
        setResponses(nextResponses);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load responses.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadResponses(token);

    return () => {
      cancelled = true;
    };
  }, [formId, isReady, token]);

  return (
    <AppShell title={`Responses for ${form?.title ?? formId}`} subtitle="Switch between trends, breakdowns, raw responses, and AI summaries for a better understanding of form performance.">
      {!isReady || isLoading ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">Loading responses...</div> : null}
      {isReady && !token ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">Sign in to view form responses.</div> : null}
      {error ? <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">{error}</div> : null}
      {token && form ? <AIInsightsPanel formId={formId} token={token} title={form.title} /> : null}
      {analytics && form ? (
        <>
          <div className="flex flex-wrap gap-2">
            <button className={`rounded-full px-4 py-2 text-sm font-medium ${activeView === "trend" ? "bg-slate-950 text-white" : "bg-white/80 text-slate-600"}`} onClick={() => setActiveView("trend")} type="button">
              Trend view
            </button>
            <button className={`rounded-full px-4 py-2 text-sm font-medium ${activeView === "breakdown" ? "bg-slate-950 text-white" : "bg-white/80 text-slate-600"}`} onClick={() => setActiveView("breakdown")} type="button">
              Breakdown view
            </button>
            <button className={`rounded-full px-4 py-2 text-sm font-medium ${activeView === "responses" ? "bg-slate-950 text-white" : "bg-white/80 text-slate-600"}`} onClick={() => setActiveView("responses")} type="button">
              Response explorer
            </button>
          </div>

          {activeView === "trend" ? (
            <Charts
              data={analytics.responseTrend}
              badgeLabel="Live responses"
              title="Daily response trend"
              description="A sharpened daily aggregate so the chart reflects actual activity, not one bar per submission."
            />
          ) : null}

          {activeView === "breakdown" ? <BreakdownBoard analytics={analytics} form={form} responses={responses} /> : null}

          {activeView === "responses" ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-ink">Response table</h2>
              <p className="mt-2 text-sm text-slate-500">{analytics.totalResponses} total responses collected.</p>
              <div className="mt-6 space-y-4">
                {responses.length ? (
                  responses.map((response) => (
                    <div key={response.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-ink">Response {response.id}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{new Date(response.submittedAt).toLocaleString()}</p>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        {response.answers.map((answer) => {
                          const label = form.fields.find((field) => field.id === answer.fieldId)?.label ?? answer.fieldId;
                          return (
                            <div key={`${response.id}-${answer.fieldId}`} className="rounded-xl bg-slate-50 px-3 py-2">
                              <span className="font-medium text-ink">{label}:</span> {Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value ?? "-")}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No responses submitted yet.</p>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </AppShell>
  );
}
