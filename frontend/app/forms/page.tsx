"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormListItem } from "@form-builder/shared";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { listFormsRequest } from "@/lib/api";

export default function AllFormsPage() {
  const { isReady, token } = useAuth();
  const [forms, setForms] = useState<FormListItem[]>([]);
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

    async function loadForms(authToken: string) {
      setIsLoading(true);
      setError(null);

      try {
        const nextForms = await listFormsRequest(authToken);
        if (!cancelled) {
          setForms(nextForms);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load forms.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadForms(token);

    return () => {
      cancelled = true;
    };
  }, [isReady, token]);

  return (
    <AppShell title="All Forms" subtitle="View every form created so far in one place.">
      {!isReady || isLoading ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">Loading forms...</div> : null}
      {isReady && !token ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">Sign in to view all forms.</div> : null}
      {error ? <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">{error}</div> : null}
      {token && !isLoading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3">
            {forms.length ? (
              forms.map((form) => (
                <div key={form.id} className="grid gap-3 rounded-2xl border border-slate-200 px-4 py-4 md:grid-cols-[1.2fr_0.7fr_0.6fr_0.8fr] md:items-center">
                  <div>
                    <p className="font-medium text-ink">{form.title}</p>
                    <p className="text-sm text-slate-500">/{form.customSlug}</p>
                  </div>
                  <p className="text-sm text-slate-500">{new Date(form.updatedAt).toLocaleDateString()}</p>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{form.isPublished ? "Published" : "Draft"}</span>
                  <div className="flex flex-wrap gap-2">
                    <Link className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" href={`/forms/${form.id}`}>
                      Open
                    </Link>
                    <Link className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white" href={`/forms/${form.id}/analytics`}>
                      Analytics
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No forms created yet.</p>
            )}
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
