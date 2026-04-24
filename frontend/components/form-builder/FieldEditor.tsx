// "use client";

// import type { FormField } from "@form-builder/shared";

// interface FieldEditorProps {
//   field: FormField;
//   onUpdate: (field: FormField) => void;
// }

// export function FieldEditor({ field, onUpdate }: FieldEditorProps) {
//   function handleChange<K extends keyof FormField>(key: K, value: FormField[K]) {
//     onUpdate({ ...field, [key]: value });
//   }

//   // Helper for advanced fields with options (like Select / Multi-Select)
//   function handleAddOption() {
//     const currentOptions = field.options || [];
//     const newId = `opt_${Date.now()}`;
//     const newOption = { id: newId, label: `Option ${currentOptions.length + 1}`, value: `Option ${currentOptions.length + 1}` };
//     handleChange("options", [...currentOptions, newOption]);
//   }

//   function handleUpdateOption(optionId: string, newValue: string) {
//     const currentOptions = field.options || [];
//     handleChange("options", currentOptions.map(opt => opt.id === optionId ? { ...opt, label: newValue, value: newValue } : opt));
//   }

//   function handleRemoveOption(optionId: string) {
//     const currentOptions = field.options || [];
//     handleChange("options", currentOptions.filter(opt => opt.id !== optionId));
//   }

//   const hasOptions = field.type === "select" || field.type === "multi_select" || field.type === "checkbox";

//   return (
//     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//       <h2 className="mb-4 border-b pb-3 text-lg font-semibold text-ink">Field Configuration</h2>

//       <div className="space-y-4">
//         <label className="block space-y-1.5 text-sm font-medium text-slate-700">
//           <span>Question Label</span>
//           <input
//             className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={field.label}
//             onChange={(event) => handleChange("label", event.target.value)}
//           />
//         </label>

//         <label className="block space-y-1.5 text-sm font-medium text-slate-700">
//           <span>Placeholder Text</span>
//           <input
//             className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={field.placeholder ?? ""}
//             placeholder="e.g., John Doe"
//             onChange={(event) => handleChange("placeholder", event.target.value)}
//           />
//         </label>

//         <label className="block space-y-1.5 text-sm font-medium text-slate-700">
//           <span>Description</span>
//           <textarea
//             className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={field.description ?? ""}
//             placeholder="Optional helper text for respondents"
//             onChange={(event) => handleChange("description", event.target.value)}
//           />
//         </label>

//         {/* Dynamic Options Editor for Advanced Fields */}
//         {hasOptions && (
//           <div className="pt-2 border-t mt-4 space-y-2">
//             <span className="text-sm font-medium text-slate-700">Choices</span>
//             <div className="space-y-2">
//               {field.options?.map((opt) => (
//                 <div key={opt.id} className="flex gap-2">
//                   <input
//                     className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={opt.label}
//                     onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
//                   />
//                   <button onClick={() => handleRemoveOption(opt.id)} className="text-slate-400 hover:text-red-500 px-2" type="button">✕</button>
//                 </div>
//               ))}
//             </div>
//             <button onClick={handleAddOption} type="button" className="text-sm text-blue-600 font-medium hover:underline mt-1">
//               + Add Option
//             </button>
//           </div>
//         )}

//         <label className="flex cursor-pointer items-center space-x-3 pt-4 text-sm font-medium text-slate-700">
//           <input
//             type="checkbox"
//             className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//             checked={field.required}
//             onChange={(event) => handleChange("required", event.target.checked)}
//           />
//           <span>Make this field required</span>
//         </label>
//       </div>
//     </div>
//   );
// }



"use client";

import type { FormField } from "@form-builder/shared";

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
}

export function FieldEditor({ field, onUpdate }: FieldEditorProps) {
  function handleChange<K extends keyof FormField>(key: K, value: FormField[K]) {
    onUpdate({ ...field, [key]: value });
  }

  // Helper for advanced fields with options (like Select / Multi-Select)
  function handleAddOption() {
    const currentOptions = field.options || [];
    const newId = `opt_${Date.now()}`;
    const newOption = { id: newId, label: `Option ${currentOptions.length + 1}`, value: `Option ${currentOptions.length + 1}` };
    handleChange("options", [...currentOptions, newOption]);
  }

  function handleUpdateOption(optionId: string, newValue: string) {
    const currentOptions = field.options || [];
    handleChange("options", currentOptions.map(opt => opt.id === optionId ? { ...opt, label: newValue, value: newValue } : opt));
  }

  function handleRemoveOption(optionId: string) {
    const currentOptions = field.options || [];
    handleChange("options", currentOptions.filter(opt => opt.id !== optionId));
  }

  // Helper for conditional logic rules
  function handleAddRule() {
    const currentRules = field.rules || [];
    handleChange("rules", [...currentRules, { sourceFieldId: "", operator: "equals", value: "" }]);
  }

  function handleUpdateRule(index: number, key: string, value: string) {
    const currentRules = [...(field.rules || [])];
    currentRules[index] = { ...currentRules[index], [key]: value };
    handleChange("rules", currentRules);
  }

  function handleRemoveRule(index: number) {
    const currentRules = field.rules || [];
    handleChange("rules", currentRules.filter((_, i) => i !== index));
  }

  const hasOptions = field.type === "select" || field.type === "multi_select" || field.type === "checkbox";

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <h2 className="mb-4 border-b pb-3 text-lg font-semibold text-ink">Field Configuration</h2>

      <div className="space-y-4">
        {/* Read-Only Field ID display to help users copy it for logic rules */}
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>Field ID:</span>
          <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{field.id}</code>
        </div>

        <label className="block space-y-1.5 text-sm font-medium text-slate-700">
          <span>Question Label</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={field.label}
            onChange={(event) => handleChange("label", event.target.value)}
          />
        </label>

        <label className="block space-y-1.5 text-sm font-medium text-slate-700">
          <span>Placeholder Text</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={field.placeholder ?? ""}
            placeholder="e.g., John Doe"
            onChange={(event) => handleChange("placeholder", event.target.value)}
          />
        </label>

        <label className="block space-y-1.5 text-sm font-medium text-slate-700">
          <span>Description</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={field.description ?? ""}
            placeholder="Optional helper text for respondents"
            onChange={(event) => handleChange("description", event.target.value)}
          />
        </label>

        {/* Dynamic Options Editor for Advanced Fields */}
        {hasOptions && (
          <div className="pt-2 border-t mt-4 space-y-2">
            <span className="text-sm font-medium text-slate-700">Choices</span>
            <div className="space-y-2">
              {field.options?.map((opt) => (
                <div key={opt.id} className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={opt.label}
                    onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                  />
                  <button onClick={() => handleRemoveOption(opt.id)} className="text-slate-400 hover:text-red-500 px-2" type="button">✕</button>
                </div>
              ))}
            </div>
            <button onClick={handleAddOption} type="button" className="text-sm text-blue-600 font-medium hover:underline mt-1">
              + Add Option
            </button>
          </div>
        )}

        <label className="flex cursor-pointer items-center space-x-3 pt-4 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={field.required}
            onChange={(event) => handleChange("required", event.target.checked)}
          />
          <span>Make this field required</span>
        </label>

        {/* Dynamic Conditional Logic Builder */}
        <div className="pt-4 border-t mt-6 space-y-4">
          <div>
            <span className="text-sm font-semibold text-ink">Conditional Logic</span>
            <p className="text-xs text-slate-500 mt-1">Show this field only if these rules are met.</p>
          </div>
          
          <div className="space-y-3">
            {(field.rules || []).map((rule, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 relative">
                <button 
                  onClick={() => handleRemoveRule(index)} 
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-sm font-bold" 
                  type="button"
                >
                  ✕
                </button>
                
                <label className="text-xs font-medium text-slate-600">If Question ID:</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. field_123456"
                  value={rule.sourceFieldId}
                  onChange={(e) => handleUpdateRule(index, "sourceFieldId", e.target.value)}
                />
                
                <label className="text-xs font-medium text-slate-600 mt-1">Condition:</label>
                <select
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={rule.operator}
                  onChange={(e) => handleUpdateRule(index, "operator", e.target.value)}
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Does Not Equal</option>
                  <option value="contains">Contains</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                </select>
                
                <label className="text-xs font-medium text-slate-600 mt-1">Value:</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Target value (e.g., Yes)"
                  value={String(rule.value)} // Fix: Wrapped rule.value in String()
                  onChange={(e) => handleUpdateRule(index, "value", e.target.value)}
                />
              </div>
            ))}
          </div>
          
          <button onClick={handleAddRule} type="button" className="text-sm text-blue-600 font-medium hover:underline mt-1">
            + Add Logic Rule
          </button>
        </div>
      </div>
    </div>
  );
}
