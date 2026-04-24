import { z } from "zod";

export const aiGenerateFormSchema = z.object({
  topic: z.string().min(3).max(160),
  requirements: z.string().max(2000).optional()
});
