"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { AiFormDraft } from "@/lib/api";
import { generateAiFormRequest } from "@/lib/api";
import { DragDropBuilder } from "@/components/form-builder/DragDropBuilder";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";

function CreateFormContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const { token } = useAuth();
  const [topic, setTopic] = useState("");
  const [requirements, setRequirements] = useState("");
  const [aiDraft, setAiDraft] = useState<AiFormDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!token) {
      setError("Sign in first to generate an AI form.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const draft = await generateAiFormRequest(
        {
          topic,
          requirements: requirements || undefined
        },
        token
      );
      setAiDraft(draft);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Failed to generate AI form.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppShell
      title="Create a New Form"
      subtitle={templateId ? "A starter template has been preloaded. Customize it and publish when ready." : "Use AI or build manually. The AI draft fills the same editor so you can still adjust every field."}
    >
      <section className="flex justify-end">
        <Link className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" href="/forms/templates">
          View Templates
        </Link>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-900 p-3 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-ink">AI Form Creation</h2>
            <p className="mt-1 text-sm text-slate-500">Write a topic and your requirements. AI will generate a draft form for you.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Topic</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Example: college event registration form"
              value={topic}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Requirements</span>
            <textarea
              className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
              onChange={(event) => setRequirements(event.target.value)}
              placeholder="Example: ask name, email, department, semester, phone number, preferred session, and additional note"
              value={requirements}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
            disabled={isGenerating || topic.trim().length < 3}
            onClick={handleGenerate}
            type="button"
          >
            {isGenerating ? "Generating form..." : "Generate Form with AI"}
          </button>
          {aiDraft ? <p className="text-sm text-green-700">AI draft loaded into the builder below.</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </section>

      <DragDropBuilder externalDraft={aiDraft} initialTemplateId={templateId} />
    </AppShell>
  );
}

export default function CreateFormPage() {
  return (
    <Suspense
      fallback={
        <AppShell
          title="Create a New Form"
          subtitle="Use AI or build manually. The AI draft fills the same editor so you can still adjust every field."
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading form builder...</div>
        </AppShell>
      }
    >
      <CreateFormContent />
    </Suspense>
  );
}
