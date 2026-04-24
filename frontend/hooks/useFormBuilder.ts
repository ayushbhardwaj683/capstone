"use client";

import type { FormField } from "@form-builder/shared";
import { useState } from "react";

export function useFormBuilder(initialFields: FormField[]) {
  const [fields, setFields] = useState<FormField[]>(initialFields);

  function addField(field: FormField) {
    setFields((current) => [...current, field]);
  }

  function reorderFields(nextFields: FormField[]) {
    setFields(nextFields);
  }

  return {
    fields,
    addField,
    reorderFields
  };
}
