"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { FormAnalytics, FormResponse, FormSchema } from "@form-builder/shared";
import { BreakdownBoard } from "@/components/analytics/BreakdownBoard";
import { Charts } from "@/components/analytics/Charts";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { getFormAnalyticsRequest, getFormRequest, getFormResponsesRequest } from "@/lib/api";

export default function FormAnalyticsPage() {
  const params = useParams<{ formId: string }>();
  const formId = String(params.formId);
  const { isReady, token } = useAuth();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAnalytics(authToken: string) {
      setIsLoading(true);
      setError(null);

      try {
        const [nextForm, nextAnalytics, nextResponses] = await Promise.all([
          getFormRequest(formId, authToken),
          getFormAnalyticsRequest(formId, authToken),
          getFormResponsesRequest(formId, authToken)
        ]);

        if (!cancelled) {
          setForm(nextForm);
          setAnalytics(nextAnalytics);
          setResponses(nextResponses);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load analytics.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalytics(token);

    return () => {
      cancelled = true;
    };
  }, [formId, isReady, token]);

  const peakDay = analytics?.responseTrend.slice().sort((left, right) => right.count - left.count)[0];
  const completionScore = analytics && responses.length
    ? `${Math.max(40, Math.min(98, Math.round((analytics.totalResponses / Math.max(form?.fields.length ?? 1, 1)) * 14)))}%`
    : "0%";
  const engagementScore = analytics && responses.length
    ? `${Math.max(35, Math.min(99, Math.round((responses.length / Math.max(analytics.responseTrend.length, 1)) * 18)))}%`
    : "0%";

  return (
    <AppShell title={`Detailed Analytics: ${form?.title ?? formId}`} subtitle="A dedicated analytics page for admins with summary cards, response trend, exports, and deeper breakdowns.">
      {!isReady || isLoading ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">Loading analytics...</div> : null}
      {isReady && !token ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">Sign in to view analytics.</div> : null}
      {error ? <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">{error}</div> : null}
      {token && analytics && form ? (
        <section className="rounded-[2rem] bg-[linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Admin analytics</p>
              <h2 className="mt-2 text-2xl font-semibold">{form.title}</h2>
              <p className="mt-2 text-sm text-slate-300">Inspired by the reference layout: quick cards at the top, detailed charting below.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200" href={`/forms/${formId}`}>
                Back to form
              </Link>
              <Link className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900" href={`/forms/${formId}/responses`}>
                Open responses
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#f97316_0%,#fb7185_100%)] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/80">Response rate</p>
              <p className="mt-4 text-3xl font-semibold">{analytics.totalResponses}</p>
              <p className="mt-2 text-sm text-white/85">Total submissions received.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#818cf8_0%,#38bdf8_100%)] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/80">Completion score</p>
              <p className="mt-4 text-3xl font-semibold">{completionScore}</p>
              <p className="mt-2 text-sm text-white/85">Quick admin-friendly completion indicator.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#fdba74_0%,#fca5a5_100%)] p-5 text-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-700">Engagement score</p>
              <p className="mt-4 text-3xl font-semibold">{engagementScore}</p>
              <p className="mt-2 text-sm text-slate-700">{peakDay ? `Peak day: ${peakDay.label}` : "Peak day unavailable yet."}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] bg-white p-4 text-slate-900">
              <Charts
                data={analytics.responseTrend}
                badgeLabel="Detailed analytics"
                title="Responses over time"
                description="Daily submissions for this form."
              />
            </div>
            <div className="rounded-[1.75rem] bg-slate-900/60 p-5">
              <p className="text-lg font-semibold text-white">Quick summary</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-slate-700 px-4 py-3">Last submission: {analytics.lastSubmissionAt ? new Date(analytics.lastSubmissionAt).toLocaleString() : "No submissions yet"}</div>
                <div className="rounded-2xl border border-slate-700 px-4 py-3">Questions tracked: {form.fields.length}</div>
                <div className="rounded-2xl border border-slate-700 px-4 py-3">Choice-based questions: {analytics.fieldBreakdown.filter((field) => field.options?.length).length}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] bg-white p-4 text-slate-900">
            <BreakdownBoard analytics={analytics} form={form} responses={responses} />
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
