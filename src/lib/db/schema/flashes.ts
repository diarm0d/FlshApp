import { flashSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getFlashes } from "@/lib/api/flashes/queries";


// Schema for flashes - used to validate API requests
const baseSchema = flashSchema.omit(timestamps)

export const insertFlashSchema = baseSchema.omit({ id: true });
export const insertFlashParams = baseSchema.extend({
  profileId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updateFlashSchema = baseSchema;
export const updateFlashParams = updateFlashSchema.extend({
  profileId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const flashIdSchema = baseSchema.pick({ id: true });

// Types for flashes - used to type API request params and within Components
export type Flash = z.infer<typeof flashSchema>;
export type NewFlash = z.infer<typeof insertFlashSchema>;
export type NewFlashParams = z.infer<typeof insertFlashParams>;
export type UpdateFlashParams = z.infer<typeof updateFlashParams>;
export type FlashId = z.infer<typeof flashIdSchema>["id"];
    
// this type infers the return from getFlashes() - meaning it will include any joins
export type CompleteFlash = Awaited<ReturnType<typeof getFlashes>>["flashes"][number];

