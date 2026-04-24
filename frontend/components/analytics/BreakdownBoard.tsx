"use client";

import type { FormAnalytics, FormResponse, FormSchema } from "@form-builder/shared";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface BreakdownBoardProps {
  analytics: FormAnalytics;
  form: FormSchema | null;
  responses: FormResponse[];
}

function toCsvValue(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function downloadResponsesCsv(form: FormSchema | null, responses: FormResponse[]) {
  const labels = form?.fields.map((field) => ({ id: field.id, label: field.label })) ?? [];
  const header = ["Submitted At", ...labels.map((entry) => entry.label)];
  const rows = responses.map((response) => {
    const answerMap = new Map(response.answers.map((answer) => [answer.fieldId, Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value ?? "")]));
    return [response.submittedAt, ...labels.map((entry) => answerMap.get(entry.id) ?? "")];
  });
  const csv = [header, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${form?.title ?? "responses"}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAnalyticsJson(form: FormSchema | null, analytics: FormAnalytics, responses: FormResponse[]) {
  const payload = {
    exportedAt: new Date().toISOString(),
    formTitle: form?.title ?? "Untitled Form",
    analytics,
    responses
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${form?.title ?? "analytics"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function BreakdownBoard({ analytics, form, responses }: BreakdownBoardProps) {
  const visibleFields = analytics.fieldBreakdown.filter((field) => field.options?.length);
  const bestField = visibleFields
    .flatMap((field) => (field.options ?? []).map((option) => ({ field: field.label, label: option.label, count: option.count })))
    .sort((left, right) => right.count - left.count)[0];
  const peakDay = analytics.responseTrend.slice().sort((left, right) => right.count - left.count)[0];
  const averagePerDay = analytics.responseTrend.length ? (analytics.totalResponses / analytics.responseTrend.length).toFixed(1) : "0.0";
  const pieData = visibleFields
    .flatMap((field) =>
      (field.options ?? []).map((option) => ({
        name: `${field.label}: ${option.label}`,
        value: option.count
      }))
    )
    .filter((entry) => entry.value > 0)
    .slice(0, 8);
  const pieColors = ["#0ea5e9", "#34d399", "#f97316", "#8b5cf6", "#f43f5e", "#22c55e", "#f59e0b", "#6366f1"];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Peak day</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{peakDay?.label ?? "No data"}</p>
          <p className="mt-2 text-sm text-slate-600">{peakDay ? `${peakDay.count} responses on the busiest day.` : "Collect more responses to view the trend."}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Average / active day</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{averagePerDay}</p>
          <p className="mt-2 text-sm text-slate-600">A cleaner indicator than the previous placeholder completion metric.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top answer pattern</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{bestField?.label ?? "No data"}</p>
          <p className="mt-2 text-sm text-slate-600">{bestField ? `${bestField.count} selections in ${bestField.field}.` : "Option analytics appear here once choice-based fields get responses."}</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Question breakdown</h3>
            <p className="mt-1 text-sm text-slate-600">See exactly how respondents answered each choice-based question.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" onClick={() => downloadResponsesCsv(form, responses)} type="button">
              Export responses CSV
            </button>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800" onClick={() => downloadAnalyticsJson(form, analytics, responses)} type="button">
              Download analytics JSON
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {visibleFields.length ? (
            visibleFields.map((field, fieldIndex) => {
              const total = Math.max(...(field.options ?? []).map((option) => option.count), 1);
              const fieldPieData = (field.options ?? [])
                .filter((option) => option.count > 0)
                .map((option) => ({
                  name: option.label,
                  value: option.count
                }));

              return (
                <div key={field.fieldId} className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                    <p className="text-base font-semibold text-slate-900">{field.label}</p>
                    <div className="mt-4 space-y-3">
                      {(field.options ?? []).map((option) => (
                        <div key={`${field.fieldId}-${option.value}`} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>{option.label}</span>
                            <span>{option.count}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" style={{ width: `${Math.max((option.count / total) * 100, option.count ? 8 : 0)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                    <p className="text-base font-semibold text-slate-900">Response distribution</p>
                    <p className="mt-1 text-sm text-slate-600">Color-coded slices show what each response option represents.</p>
                    {fieldPieData.length ? (
                      <div className="mt-4 h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={fieldPieData} dataKey="value" nameKey="name" cx="50%" cy="43%" innerRadius={54} outerRadius={94} paddingAngle={3}>
                              {fieldPieData.map((entry, index) => (
                                <Cell key={`${entry.name}-${fieldIndex}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={90} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                        Pie chart appears once this question receives responses.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No dropdown, checkbox, or multi-select breakdown is available yet for this form.</p>
          )}
        </div>
      </div>
    </section>
  );
}
