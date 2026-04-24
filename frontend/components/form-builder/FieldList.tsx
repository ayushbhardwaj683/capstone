"use client";

import type { FieldType } from "@form-builder/shared";

interface FieldListProps {
  onAddField: (type: FieldType, label: string) => void;
}

const availableTools: Array<{ type: FieldType; label: string; defaultQuestion: string }> = [
  { type: "short_text", label: "Short Text", defaultQuestion: "What is your full name?" },
  { type: "long_text", label: "Long Text", defaultQuestion: "Please share your feedback." },
  { type: "email", label: "Email", defaultQuestion: "What is your email address?" },
  { type: "phone", label: "Phone", defaultQuestion: "What is your phone number?" },
  { type: "number", label: "Number", defaultQuestion: "How many attendees joined?" },
  { type: "select", label: "Dropdown", defaultQuestion: "Choose an option" },
  { type: "multi_select", label: "Multi Select", defaultQuestion: "Select all that apply" },
  { type: "date", label: "Date", defaultQuestion: "Which date works best?" },
  { type: "time", label: "Time", defaultQuestion: "What time do you prefer?" },
  { type: "rating", label: "Rating", defaultQuestion: "How would you rate the event?" }
];

export function FieldList({ onAddField }: FieldListProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div>
        <h2 className="text-lg font-semibold text-ink">Question Inventory</h2>
        <p className="mt-1 text-sm text-slate-500">Click a field type to add it to your form.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {availableTools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => onAddField(tool.type, tool.defaultQuestion)}
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-blue-50"
            type="button"
          >
            {tool.label}
          </button>
        ))}
      </div>
    </div>
  );
}
