"use client";

import { TemplateGallery } from "@/components/dashboard/TemplateGallery";
import { AppShell } from "@/components/layout/AppShell";

export default function FormTemplatesPage() {
  return (
    <AppShell title="Form Templates" subtitle="Browse all pre-created templates and start with the one that matches your use case.">
      <TemplateGallery showStartFromScratch />
    </AppShell>
  );
}
