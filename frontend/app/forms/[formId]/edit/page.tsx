// "use client";

// import { useParams } from "next/navigation";
// import { DragDropBuilder } from "@/components/form-builder/DragDropBuilder";
// import { AppShell } from "@/components/layout/AppShell";

// export default function EditFormPage() {
//   const params = useParams<{ formId: string }>();
//   const formId = String(params.formId);
//   const router = useRouter();
//   const [publishedLink, setPublishedLink] = useState<string | null>(null);

//   return (
//     <AppShell title={`Editing ${formId}`} subtitle="This builder is now connected to the backend for loading and updating forms.">
//       <DragDropBuilder formId={formId} />
//     </AppShell>
//   );
// }




"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DragDropBuilder } from "@/components/form-builder/DragDropBuilder";
import { AppShell } from "@/components/layout/AppShell";

export default function EditFormPage() {
  const params = useParams<{ formId: string }>();
  const formId = String(params.formId);

  const router = useRouter();

  const [publishedLink, setPublishedLink] = useState<string | null>(null);

  function handlePublishSuccess(formId: string) {
    const formLink = `${window.location.origin}/forms/${formId}`;
    setPublishedLink(formLink);
  }

  return (
    <AppShell
      title={`Editing ${formId}`}
      subtitle="This builder is now connected to the backend for loading and updating forms."
    >

      {/* Publish Success Message */}
      {publishedLink && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-lg font-semibold text-green-800">
            ✅ Form Published Successfully
          </h2>

          <p className="text-sm text-green-700 mt-2">
            Your form is now live and ready to collect responses.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="text"
              readOnly
              value={publishedLink}
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />

            <button
              onClick={() => navigator.clipboard.writeText(publishedLink)}
              className="rounded-lg bg-black text-white px-4 py-2 text-sm"
            >
              Copy
            </button>

            <a
              href={publishedLink}
              target="_blank"
              className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm"
            >
              Open
            </a>
          </div>
        </div>
      )}

      {/* Form Builder */}
      <DragDropBuilder
        formId={formId}
        onPublishSuccess={() => handlePublishSuccess(formId)}
      />

    </AppShell>
  );
}