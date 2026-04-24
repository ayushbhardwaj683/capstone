
// "use client";

// import type { FormField } from "@form-builder/shared";
// import { useState } from "react";
// import { submitPublicResponseRequest } from "@/lib/api";

// interface FormRendererProps {
//   slug: string;
//   title: string;
//   description?: string;
//   fields: FormField[];
// }

// type FieldValue = string | string[] | number | boolean | null;

// function getInputType(type: FormField["type"]) {
//   switch (type) {
//     case "email":
//       return "email";
//     case "phone":
//       return "tel";
//     case "number":
//     case "rating":
//     case "linear_scale":
//       return "number";
//     case "date":
//       return "date";
//     case "time":
//       return "time";
//     default:
//       return "text";
//   }
// }

// function getStringValue(value: FieldValue): string {
//   if (typeof value === "string") {
//     return value;
//   }

//   if (typeof value === "number") {
//     return String(value);
//   }

//   return "";
// }

// function getArrayValue(value: FieldValue): string[] {
//   return Array.isArray(value) ? value.map((entry) => String(entry)) : [];
// }

// export function FormRenderer({ slug, title, description, fields }: FormRendererProps) {
//   const [values, setValues] = useState<Record<string, FieldValue>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
  
//   // State to track if the form was successfully submitted
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   function updateValue(fieldId: string, value: FieldValue) {
//     setValues((current) => ({ ...current, [fieldId]: value }));
//   }

//   // 🔥 NEW: SMART CONDITIONAL LOGIC EVALUATOR
//   function isFieldVisible(field: FormField) {
//     if (!field.rules || field.rules.length === 0) return true; // Show by default

//     // Evaluate all rules attached to this field
//     return field.rules.every((rule) => {
//       const sourceValue = values[rule.sourceFieldId];
//       if (sourceValue === undefined || sourceValue === null) return false;

//       switch (rule.operator) {
//         case "equals":
//           return String(sourceValue) === String(rule.value);
//         case "not_equals":
//           return String(sourceValue) !== String(rule.value);
//         case "contains":
//           return String(sourceValue).toLowerCase().includes(String(rule.value).toLowerCase());
//         case "greater_than":
//           return Number(sourceValue) > Number(rule.value);
//         case "less_than":
//           return Number(sourceValue) < Number(rule.value);
//         default:
//           return true;
//       }
//     });
//   }

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setMessage(null);
//     setError(null);

//     try {
//       // Only submit answers for fields that are currently visible
//       const visibleFields = fields.filter(isFieldVisible);
//       const answers = visibleFields.map((field) => ({
//         fieldId: field.id,
//         value: values[field.id] ?? null
//       }));

//       await submitPublicResponseRequest(slug, answers);
      
//       // Trigger the success UI and clear the form
//       setIsSubmitted(true);
//       setValues({});
//     } catch (submitError) {
//       setError(submitError instanceof Error ? submitError.message : "Failed to submit response.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   // --- SUCCESS SCREEN UI ---
//   if (isSubmitted) {
//     return (
//       <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
//         <div className="space-y-2">
//           <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
//         </div>
//         <div className="mt-8">
//           <p className="text-sm text-slate-600">Response submitted successfully.</p>
          
//           <button
//             onClick={() => {
//               setIsSubmitted(false);
//               setMessage(null);
//             }}
//             className="mt-6 text-sm font-medium text-blue-600 underline-offset-4 hover:underline focus:outline-none"
//             type="button"
//           >
//             Submit another response
//           </button>
//         </div>
//       </section>
//     );
//   }

//   // --- MAIN FORM UI ---
//   return (
//     <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
//       <div className="space-y-2">
//         <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
//         <p className="text-sm text-slate-500">{description}</p>
//       </div>
//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         {fields.map((field) => {
//           // 🔥 NEW: Check visibility before rendering
//           if (!isFieldVisible(field)) return null;

//           const currentValue = values[field.id] ?? null;

//           if (field.type === "long_text") {
//             return (
//               <label key={field.id} className="block space-y-2">
//                 <span className="text-sm font-medium text-ink">{field.label}</span>
//                 <textarea
//                   className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
//                   placeholder={field.placeholder ?? "Your answer"}
//                   required={field.required}
//                   value={getStringValue(currentValue)}
//                   onChange={(event) => updateValue(field.id, event.target.value)}
//                 />
//               </label>
//             );
//           }

//           if (field.type === "select") {
//             return (
//               <label key={field.id} className="block space-y-2">
//                 <span className="text-sm font-medium text-ink">{field.label}</span>
//                 <select
//                   className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                   required={field.required}
//                   value={getStringValue(currentValue)}
//                   onChange={(event) => updateValue(field.id, event.target.value)}
//                 >
//                   <option value="">Select an option</option>
//                   {(field.options ?? []).map((option) => (
//                     <option key={option.id} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//             );
//           }

//           if (field.type === "multi_select") {
//             return (
//               <label key={field.id} className="block space-y-2">
//                 <span className="text-sm font-medium text-ink">{field.label}</span>
//                 <select
//                   className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
//                   multiple
//                   required={field.required}
//                   value={getArrayValue(currentValue)}
//                   onChange={(event) =>
//                     updateValue(
//                       field.id,
//                       Array.from(event.target.selectedOptions).map((option) => option.value)
//                     )
//                   }
//                 >
//                   {(field.options ?? []).map((option) => (
//                     <option key={option.id} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//             );
//           }

//           if (field.type === "checkbox") {
//             return (
//               <label key={field.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
//                 <input
//                   type="checkbox"
//                   checked={Boolean(currentValue)}
//                   onChange={(event) => updateValue(field.id, event.target.checked)}
//                 />
//                 <span className="text-sm font-medium text-ink">{field.label}</span>
//               </label>
//             );
//           }

//           return (
//             <label key={field.id} className="block space-y-2">
//               <span className="text-sm font-medium text-ink">{field.label}</span>
//               <input
//                 className="w-full rounded-2xl border border-slate-200 px-4 py-3"
//                 placeholder={field.placeholder ?? "Your answer"}
//                 type={getInputType(field.type)}
//                 min={field.min}
//                 max={field.max}
//                 required={field.required}
//                 value={getStringValue(currentValue)}
//                 onChange={(event) =>
//                   updateValue(
//                     field.id,
//                     field.type === "number" || field.type === "rating" || field.type === "linear_scale"
//                       ? Number(event.target.value)
//                       : event.target.value
//                   )
//                 }
//               />
//             </label>
//           );
//         })}
//         {message ? <p className="text-sm text-green-700">{message}</p> : null}
//         {error ? <p className="text-sm text-red-600">{error}</p> : null}
//         <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting} type="submit">
//           {isSubmitting ? "Submitting..." : "Submit response"}
//         </button>
//       </form>
//     </section>
//   );
// }



"use client";

import type { FormField } from "@form-builder/shared";
import { useState } from "react";
import { submitPublicResponseRequest } from "@/lib/api";

interface FormRendererProps {
  slug: string;
  title: string;
  description?: string;
  fields: FormField[];
}

type FieldValue = string | string[] | number | boolean | null;

function getInputType(type: FormField["type"]) {
  switch (type) {
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "number":
    case "rating":
    case "linear_scale":
      return "number";
    case "date":
      return "date";
    case "time":
      return "time";
    default:
      return "text";
  }
}

function getStringValue(value: FieldValue): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function getArrayValue(value: FieldValue): string[] {
  return Array.isArray(value) ? value.map((entry) => String(entry)) : [];
}

export function FormRenderer({ slug, title, description, fields }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  // NEW: State to track if the response limit was hit during submission
  const [isLimitReached, setIsLimitReached] = useState(false);

  function updateValue(fieldId: string, value: FieldValue) {
    setValues((current) => ({ ...current, [fieldId]: value }));
  }

  function isFieldVisible(field: FormField) {
    if (!field.rules || field.rules.length === 0) return true;

    return field.rules.every((rule) => {
      const sourceValue = values[rule.sourceFieldId];
      if (sourceValue === undefined || sourceValue === null) return false;

      switch (rule.operator) {
        case "equals":
          return String(sourceValue) === String(rule.value);
        case "not_equals":
          return String(sourceValue) !== String(rule.value);
        case "contains":
          return String(sourceValue).toLowerCase().includes(String(rule.value).toLowerCase());
        case "greater_than":
          return Number(sourceValue) > Number(rule.value);
        case "less_than":
          return Number(sourceValue) < Number(rule.value);
        default:
          return true;
      }
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const visibleFields = fields.filter(isFieldVisible);
      const answers = visibleFields.map((field) => ({
        fieldId: field.id,
        value: values[field.id] ?? null
      }));

      await submitPublicResponseRequest(slug, answers);
      
      setIsSubmitted(true);
      setValues({});
    } catch (submitError) {
      const errorMessage = submitError instanceof Error ? submitError.message : "Failed to submit response.";
      
      // NEW: Intercept the specific limits/capacity error messages from the backend
      if (errorMessage.toLowerCase().includes("full") || errorMessage.toLowerCase().includes("capacity") || errorMessage.toLowerCase().includes("expired")) {
        setIsLimitReached(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- LIMIT REACHED UI ---
  if (isLimitReached) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        </div>
        <div className="mt-8">
          <p className="text-sm text-slate-600">
            The form limit has been reached and it is no longer accepting responses. If you believe this is a mistake, please contact the admin of the form. Thank you!
          </p>
        </div>
      </section>
    );
  }

  // --- SUCCESS SCREEN UI ---
  if (isSubmitted) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        </div>
        <div className="mt-8">
          <p className="text-sm text-slate-600">Response submitted successfully.</p>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setMessage(null);
            }}
            className="mt-6 text-sm font-medium text-blue-600 underline-offset-4 hover:underline focus:outline-none"
            type="button"
          >
            Submit another response
          </button>
        </div>
      </section>
    );
  }

  // --- MAIN FORM UI ---
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {fields.map((field) => {
          if (!isFieldVisible(field)) return null;

          const currentValue = values[field.id] ?? null;

          if (field.type === "long_text") {
            return (
              <label key={field.id} className="block space-y-2">
                <span className="text-sm font-medium text-ink">{field.label}</span>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder={field.placeholder ?? "Your answer"}
                  required={field.required}
                  value={getStringValue(currentValue)}
                  onChange={(event) => updateValue(field.id, event.target.value)}
                />
              </label>
            );
          }

          if (field.type === "select") {
            return (
              <label key={field.id} className="block space-y-2">
                <span className="text-sm font-medium text-ink">{field.label}</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  required={field.required}
                  value={getStringValue(currentValue)}
                  onChange={(event) => updateValue(field.id, event.target.value)}
                >
                  <option value="">Select an option</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (field.type === "multi_select") {
            return (
              <label key={field.id} className="block space-y-2">
                <span className="text-sm font-medium text-ink">{field.label}</span>
                <select
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  multiple
                  required={field.required}
                  value={getArrayValue(currentValue)}
                  onChange={(event) =>
                    updateValue(
                      field.id,
                      Array.from(event.target.selectedOptions).map((option) => option.value)
                    )
                  }
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (field.type === "checkbox") {
            return (
              <label key={field.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(currentValue)}
                  onChange={(event) => updateValue(field.id, event.target.checked)}
                />
                <span className="text-sm font-medium text-ink">{field.label}</span>
              </label>
            );
          }

          return (
            <label key={field.id} className="block space-y-2">
              <span className="text-sm font-medium text-ink">{field.label}</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder={field.placeholder ?? "Your answer"}
                type={getInputType(field.type)}
                min={field.min}
                max={field.max}
                required={field.required}
                value={getStringValue(currentValue)}
                onChange={(event) =>
                  updateValue(
                    field.id,
                    field.type === "number" || field.type === "rating" || field.type === "linear_scale"
                      ? Number(event.target.value)
                      : event.target.value
                  )
                }
              />
            </label>
          );
        })}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting..." : "Submit response"}
        </button>
      </form>
    </section>
  );
}