// "use client";

// import type { FieldType, FormField, FormSettings } from "@form-builder/shared";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { createFormRequest, getFormRequest, updateFormRequest } from "@/lib/api";
// import { FieldEditor } from "./FieldEditor";
// import { FieldList } from "./FieldList";
// import { SortableFieldItem } from "./SortableFieldItem";
// import { 
//   DndContext, 
//   closestCenter, 
//   KeyboardSensor, 
//   PointerSensor, 
//   useSensor, 
//   useSensors, 
//   DragEndEvent 
// } from "@dnd-kit/core";
// import { 
//   arrayMove, 
//   SortableContext, 
//   sortableKeyboardCoordinates, 
//   verticalListSortingStrategy 
// } from "@dnd-kit/sortable";

// interface DragDropBuilderProps {
//   formId?: string;
//   onPublishSuccess?: () => void; // Added this line to fix the TypeScript error
// }

// const defaultSettings: FormSettings = {
//   isPublished: false,
//   customSlug: "",
//   requireAuth: false,
//   passwordProtected: false
// };

// function slugify(input: string) {
//   return input
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// function getDefaultPlaceholder(type: FieldType) {
//   switch (type) {
//     case "email": return "you@example.com";
//     case "phone": return "+94 77 123 4567";
//     case "number":
//     case "rating":
//     case "linear_scale": return "Enter a number";
//     case "date": return "Select a date";
//     case "time": return "Select a time";
//     default: return "Your answer";
//   }
// }

// export function DragDropBuilder({ formId, onPublishSuccess }: DragDropBuilderProps) {
//   const router = useRouter();
//   const { isReady, token } = useAuth();
//   const [formTitle, setFormTitle] = useState("Untitled Form");
//   const [description, setDescription] = useState("");
//   const [fields, setFields] = useState<FormField[]>([]);
//   const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
//   const [settings, setSettings] = useState<FormSettings>(defaultSettings);
//   const [isLoading, setIsLoading] = useState(Boolean(formId));
//   const [isSaving, setIsSaving] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
//   );

//   useEffect(() => {
//     const currentFormId = formId;
//     const authToken = token;

//     if (!isReady || currentFormId == null || authToken == null) {
//       setIsLoading(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadForm(nextFormId: string, nextToken: string) {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const form = await getFormRequest(nextFormId, nextToken);
//         if (cancelled) return;

//         setFormTitle(form.title);
//         setDescription(form.description ?? "");
//         setFields(form.fields);
//         setSelectedFieldId(form.fields[0]?.id ?? null);
//         setSettings(form.settings);
//       } catch (loadError) {
//         if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Failed to load the form.");
//       } finally {
//         if (!cancelled) setIsLoading(false);
//       }
//     }

//     void loadForm(currentFormId, authToken);
//     return () => { cancelled = true; };
//   }, [formId, isReady, token]);

//   function handleAddField(type: FieldType, label: string) {
//     const newField: FormField = {
//       id: `field_${Date.now()}`,
//       type,
//       label,
//       required: false,
//       placeholder: getDefaultPlaceholder(type),
//       options: ["select", "multi_select"].includes(type) 
//         ? [{ id: `opt_${Date.now()}`, label: "Option 1", value: "Option 1" }] 
//         : undefined
//     };

//     setFields((current) => [...current, newField]);
//     setSelectedFieldId(newField.id);
//   }

//   function handleUpdateField(updatedField: FormField) {
//     setFields((current) => current.map((field) => (field.id === updatedField.id ? updatedField : field)));
//   }

//   function handleDeleteField(id: string) {
//     setFields((current) => current.filter((field) => field.id !== id));
//     if (selectedFieldId === id) setSelectedFieldId(null);
//   }

//   function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       setFields((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over.id);
//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   }

//   async function handleSaveForm() {
//     if (!token) { setError("Please sign in to save your form."); return; }
//     setIsSaving(true);
//     setError(null);
//     setMessage(null);

//     try {
//       const payload = {
//         title: formTitle,
//         description,
//         fields,
//         settings: {
//           customSlug: settings.customSlug || slugify(formTitle) || `form-${Date.now()}`,
//           expiresAt: settings.expiresAt,
//           responseLimit: settings.responseLimit,
//           requireAuth: settings.requireAuth,
//           passwordProtected: settings.passwordProtected,
//           allowResponseEditing: false,
//           isPublished: true // Set to true so the publish link works
//         }
//       };

//       const savedForm = formId
//         ? await updateFormRequest(formId, payload, token)
//         : await createFormRequest(payload, token);

//       setSettings(savedForm.settings);
//       setMessage(formId ? "Form updated successfully." : "Form created successfully.");

//       // Fire the success callback if it was passed in
//       if (onPublishSuccess) {
//         onPublishSuccess();
//       }

//       if (!formId) router.push(`/forms/${savedForm.id}`);
//     } catch (saveError) {
//       setError(saveError instanceof Error ? saveError.message : "Failed to save the form.");
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   if (!isReady) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Checking authentication...</div>;
//   if (!token) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Sign in first to create or edit forms.</div>;
//   if (isLoading) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading form data...</div>;

//   return (
//     <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
//       <div className="space-y-6">
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="w-full space-y-3">
//               <input
//                 type="text"
//                 value={formTitle}
//                 onChange={(event) => setFormTitle(event.target.value)}
//                 className="w-full border-b border-transparent bg-transparent text-2xl font-bold text-ink outline-none transition-colors placeholder-slate-400 focus:border-slate-300"
//                 placeholder="Enter form title..."
//               />
//               <textarea
//                 value={description}
//                 onChange={(event) => setDescription(event.target.value)}
//                 className="min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-300"
//                 placeholder="Optional description for your form"
//               />
//               <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
//                 Public slug: /{settings.customSlug || slugify(formTitle) || "form-slug"}
//               </p>
//             </div>
//             <button
//               onClick={handleSaveForm}
//               disabled={isSaving || fields.length === 0}
//               className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
//               type="button"
//             >
//               {isSaving ? "Publishing..." : formId ? "Update & Publish" : "Save & Publish"}
//             </button>
//           </div>
//           {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
//           {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
//         </div>

//         {/* Drag and Drop Canvas */}
//         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//           <div className="flex flex-col gap-3 min-h-[300px] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
//             {fields.length === 0 ? (
//               <div className="flex h-full items-center justify-center text-sm text-slate-400">
//                 Click a field on the right to add it to your form.
//               </div>
//             ) : (
//               <SortableContext items={fields} strategy={verticalListSortingStrategy}>
//                 {fields.map((field) => (
//                   <SortableFieldItem
//                     key={field.id}
//                     field={field}
//                     isSelected={selectedFieldId === field.id}
//                     onSelect={() => setSelectedFieldId(field.id)}
//                     onDelete={() => handleDeleteField(field.id)}
//                   />
//                 ))}
//               </SortableContext>
//             )}
//           </div>
//         </DndContext>
//       </div>

//       <div className="space-y-6">
//         {selectedField ? (
//           <FieldEditor field={selectedField} onUpdate={handleUpdateField} />
//         ) : (
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
//             Select a field on the canvas to edit its properties.
//           </div>
//         )}
//         <FieldList onAddField={handleAddField} />
//       </div>
//     </div>
//   );
// }





"use client";

import type { FieldType, FormField, FormSettings } from "@form-builder/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { AiFormDraft } from "@/lib/api";
import { createFormRequest, getFormRequest, updateFormRequest } from "@/lib/api";
import { getTemplateById } from "@/lib/form-templates";
import { FieldEditor } from "./FieldEditor";
import { FieldList } from "./FieldList";
import { SortableFieldItem } from "./SortableFieldItem";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

interface DragDropBuilderProps {
  formId?: string;
  onPublishSuccess?: () => void;
  initialTemplateId?: string | null;
  externalDraft?: AiFormDraft | null;
}

const defaultSettings: FormSettings = {
  isPublished: false,
  customSlug: "",
  requireAuth: false,
  passwordProtected: false
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getDefaultPlaceholder(type: FieldType) {
  switch (type) {
    case "email": return "you@example.com";
    case "phone": return "+94 77 123 4567";
    case "number":
    case "rating":
    case "linear_scale": return "Enter a number";
    case "date": return "Select a date";
    case "time": return "Select a time";
    default: return "Your answer";
  }
}

export function DragDropBuilder({ formId, onPublishSuccess, initialTemplateId, externalDraft }: DragDropBuilderProps) {
  const router = useRouter();
  const { isReady, token } = useAuth();
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [settings, setSettings] = useState<FormSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(Boolean(formId));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const currentFormId = formId;
    const authToken = token;

    if (!isReady || currentFormId == null || authToken == null) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadForm(nextFormId: string, nextToken: string) {
      setIsLoading(true);
      setError(null);

      try {
        const form = await getFormRequest(nextFormId, nextToken);
        if (cancelled) return;

        setFormTitle(form.title);
        setDescription(form.description ?? "");
        setFields(form.fields);
        setSelectedFieldId(form.fields[0]?.id ?? null);
        setSettings(form.settings);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Failed to load the form.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadForm(currentFormId, authToken);
    return () => { cancelled = true; };
  }, [formId, isReady, token]);

  useEffect(() => {
    if (formId || !initialTemplateId) {
      return;
    }

    const template = getTemplateById(initialTemplateId);
    if (!template) {
      return;
    }

    setFormTitle(template.title);
    setDescription(template.description);
    setFields(template.fields.map((field) => ({ ...field })));
    setSelectedFieldId(template.fields[0]?.id ?? null);
    setSettings((current) => ({
      ...current,
      ...template.settings,
      isPublished: false
    }));
  }, [formId, initialTemplateId]);

  useEffect(() => {
    if (formId || !externalDraft) {
      return;
    }

    setFormTitle(externalDraft.title);
    setDescription(externalDraft.description);
    setFields(externalDraft.fields.map((field) => ({ ...field })));
    setSelectedFieldId(externalDraft.fields[0]?.id ?? null);
    setSettings((current) => ({
      ...current,
      customSlug: externalDraft.settings.customSlug,
      requireAuth: externalDraft.settings.requireAuth,
      passwordProtected: externalDraft.settings.passwordProtected,
      isPublished: false
    }));
  }, [externalDraft, formId]);

  function handleAddField(type: FieldType, label: string) {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label,
      required: false,
      placeholder: getDefaultPlaceholder(type),
      options: ["select", "multi_select"].includes(type) 
        ? [{ id: `opt_${Date.now()}`, label: "Option 1", value: "Option 1" }] 
        : undefined
    };

    setFields((current) => [...current, newField]);
    setSelectedFieldId(newField.id);
  }

  function handleUpdateField(updatedField: FormField) {
    setFields((current) => current.map((field) => (field.id === updatedField.id ? updatedField : field)));
  }

  function handleDeleteField(id: string) {
    setFields((current) => current.filter((field) => field.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  async function handleSaveForm() {
    if (!token) { setError("Please sign in to save your form."); return; }
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        title: formTitle,
        description,
        fields,
        settings: {
          customSlug: settings.customSlug || slugify(formTitle) || `form-${Date.now()}`,
          expiresAt: settings.expiresAt,
          responseLimit: settings.responseLimit,
          requireAuth: settings.requireAuth,
          passwordProtected: settings.passwordProtected,
          allowResponseEditing: false,
          isPublished: true // Set to true so the publish link works
        }
      };

      const savedForm = formId
        ? await updateFormRequest(formId, payload, token)
        : await createFormRequest(payload, token);

      setSettings(savedForm.settings);
      setMessage(formId ? "Form updated successfully." : "Form created successfully.");

      // Fire the success callback if it was passed in
      if (onPublishSuccess) {
        onPublishSuccess();
      }

      if (!formId) router.push(`/forms/${savedForm.id}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save the form.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Checking authentication...</div>;
  if (!token) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Sign in first to create or edit forms.</div>;
  if (isLoading) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading form data...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="w-full space-y-3">
              <input
                type="text"
                value={formTitle}
                onChange={(event) => setFormTitle(event.target.value)}
                className="w-full border-b border-transparent bg-transparent text-2xl font-bold text-ink outline-none transition-colors placeholder-slate-400 focus:border-slate-300"
                placeholder="Enter form title..."
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-300"
                placeholder="Optional description for your form"
              />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Public slug: /{settings.customSlug || slugify(formTitle) || "form-slug"}
              </p>

              {/* NEW: Settings UI for Limits & Expiry */}
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                  <span>Response Limit</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 100 (Leave empty for no limit)"
                    value={settings.responseLimit || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, responseLimit: e.target.value ? parseInt(e.target.value) : undefined })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                  <span>Expiry Date & Time</span>
                  <input
                    type="datetime-local"
                    value={settings.expiresAt ? new Date(settings.expiresAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
              </div>

            </div>
            <button
              onClick={handleSaveForm}
              disabled={isSaving || fields.length === 0}
              className="mt-1 shrink-0 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:opacity-50"
              type="button"
            >
              {isSaving ? "Publishing..." : formId ? "Update & Publish" : "Save & Publish"}
            </button>
          </div>
          {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        {/* Drag and Drop Canvas */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex min-h-[300px] flex-col gap-3 rounded-3xl border-2 border-dashed border-sky-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(240,249,255,0.9)_100%)] p-4">
            {fields.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Click a field on the right to add it to your form.
              </div>
            ) : (
              <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                {fields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    onSelect={() => setSelectedFieldId(field.id)}
                    onDelete={() => handleDeleteField(field.id)}
                  />
                ))}
              </SortableContext>
            )}
          </div>
        </DndContext>
      </div>

      <div className="space-y-6">
        {selectedField ? (
          <FieldEditor field={selectedField} onUpdate={handleUpdateField} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            Select a field on the canvas to edit its properties.
          </div>
        )}
        <FieldList onAddField={handleAddField} />
      </div>
    </div>
  );
}
