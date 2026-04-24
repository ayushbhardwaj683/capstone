"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import type { FormField } from "./DragDropBuilder";
import type { FormField } from "@form-builder/shared";

interface SortableFieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SortableFieldItem({ field, isSelected, onSelect, onDelete }: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-[1.35rem] border bg-white/90 p-4 shadow-sm transition ${
        isSelected ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200 hover:-translate-y-0.5 hover:border-sky-300"
      }`}
      onClick={onSelect}
    >
      {/* Drag Handle (The part you click and hold to drag) */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{field.type.replace('_', ' ')}</p>
        <p className="mt-1 text-base font-medium text-ink">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </p>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="text-slate-400 hover:text-red-500 text-sm opacity-0 group-hover:opacity-100 transition px-2"
      >
        Delete
      </button>
    </div>
  );
}
