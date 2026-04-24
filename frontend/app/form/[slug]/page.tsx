// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import type { FormSchema } from "@form-builder/shared";
// import { FormRenderer } from "@/components/form-renderer/FormRenderer";
// import { getPublicFormRequest } from "@/lib/api";

// export default function PublicFormPage() {
//   const params = useParams<{ slug: string }>();
//   const slug = String(params.slug);
//   const [form, setForm] = useState<FormSchema | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadPublicForm() {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const nextForm = await getPublicFormRequest(slug);
//         if (!cancelled) {
//           setForm(nextForm);
//         }
//       } catch (loadError) {
//         if (!cancelled) {
//           setError(loadError instanceof Error ? loadError.message : "Failed to load the public form.");
//         }
//       } finally {
//         if (!cancelled) {
//           setIsLoading(false);
//         }
//       }
//     }

//     void loadPublicForm();

//     return () => {
//       cancelled = true;
//     };
//   }, [slug]);

//   if (isLoading) {
//     return <div className="px-6 py-12"><div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Loading public form...</div></div>;
//   }

//   if (error) {
//     return <div className="px-6 py-12"><div className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">{error}</div></div>;
//   }

//   if (!form) {
//     return null;
//   }

//   return (
//     <div className="px-6 py-12">
//       <FormRenderer slug={slug} title={form.title} description={form.description} fields={form.fields} />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { FormSchema } from "@form-builder/shared";
import { FormRenderer } from "@/components/form-renderer/FormRenderer";
import { getPublicFormRequest } from "@/lib/api";

export default function PublicFormPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug);
  const [form, setForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicForm() {
      setIsLoading(true);
      setError(null);

      try {
        const nextForm = await getPublicFormRequest(slug);
        if (!cancelled) {
          setForm(nextForm);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load the public form.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPublicForm();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return <div className="px-6 py-12"><div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Loading public form...</div></div>;
  }

  if (error) {
    const isLimitError = error.toLowerCase().includes("capacity") || error.toLowerCase().includes("expired") || error.toLowerCase().includes("full");

    if (isLimitError) {
      return (
        <div className="px-6 py-12">
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-ink">Form Closed</h1>
            </div>
            <div className="mt-8">
              <p className="text-sm text-slate-600">
                The form limit has been reached and it is no longer accepting responses. If you believe this is a mistake, please contact the admin of the form. Thank you!
              </p>
            </div>
          </section>
        </div>
      );
    }

    // Default red error box for other types of errors (e.g., 404 Not Found, Network Error)
    return <div className="px-6 py-12"><div className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">{error}</div></div>;
  }

  if (!form) {
    return null;
  }

  return (
    <div className="px-6 py-12">
      <FormRenderer slug={slug} title={form.title} description={form.description} fields={form.fields} />
    </div>
  );
}