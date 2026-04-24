"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { FormSchema } from "@form-builder/shared";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { getFormRequest, publishFormRequest } from "@/lib/api";

export default function FormOverviewPage() {
  const params = useParams<{ formId: string }>();
  const formId = String(params.formId);
  const { isReady, token } = useAuth();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
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

    async function loadForm(authToken: string) {
      setIsLoading(true);
      setError(null);

      try {
        const nextForm = await getFormRequest(formId, authToken);
        if (!cancelled) {
          setForm(nextForm);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load form details.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadForm(token);

    return () => {
      cancelled = true;
    };
  }, [formId, isReady, token]);

  async function handlePublish() {
    if (!token) {
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const nextForm = await publishFormRequest(formId, token);
      setForm(nextForm);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Failed to publish the form.");
    } finally {
      setIsPublishing(false);
    }
  }

  // const publicUrl = form ? `/form/${form.settings.customSlug}` : "";
const publicUrl = form
  ? `${typeof window !== "undefined" ? window.location.origin : ""}/form/${form.settings.customSlug}`
  : "";
  const qrUrl = publicUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}` : "";
  return (
    <AppShell title="Form overview" subtitle="Manage form metadata, publishing, sharing, and access to responses.">
      {!isReady || isLoading ? <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Loading form overview...</div> : null}
      {isReady && !token ? <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Sign in to manage this form.</div> : null}
      {error ? <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">{error}</div> : null}
      {form ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Form ID</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{form.id}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
              <p className="mt-2 text-base font-medium text-ink">{form.settings.isPublished ? "Published" : "Draft"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Public slug</p>
              <p className="mt-2 text-base font-medium text-ink">/{form.settings.customSlug}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Questions</p>
              <p className="mt-2 text-base font-medium text-ink">{form.fields.length}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_220px]">
            <div>
              <p className="text-sm text-slate-500">Public link</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="font-medium text-ink">{publicUrl}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                  className="rounded-full border px-3 py-1 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500">QR code</p>
              {qrUrl ? (
                <div className="mt-3 space-y-3">
                  <img alt="Form QR code" className="mx-auto h-[180px] w-[180px] rounded-xl border border-slate-200" src={qrUrl} />
                  <a className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" download={`form-${form.settings.customSlug}-qr.png`} href={qrUrl} target="_blank">
                    Download QR
                  </a>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" href={`/forms/${formId}/edit`}>
              Edit form
            </Link>
            <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700" href={`/forms/${formId}/responses`}>
              View responses
            </Link>
            <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700" href={`/forms/${formId}/analytics`}>
              View analytics
            </Link>
            {!form.settings.isPublished ? (
              <button className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white" disabled={isPublishing} onClick={handlePublish} type="button">
                {isPublishing ? "Publishing..." : "Publish form"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
