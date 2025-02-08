import { availableTimeSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getAvailableTimes } from "@/lib/api/availableTimes/queries";


// Schema for availableTimes - used to validate API requests
const baseSchema = availableTimeSchema.omit(timestamps)

export const insertAvailableTimeSchema = baseSchema.omit({ id: true });
export const insertAvailableTimeParams = baseSchema.extend({
  isActive: z.coerce.boolean()
}).omit({ 
  id: true,
  userId: true
});

export const updateAvailableTimeSchema = baseSchema;
export const updateAvailableTimeParams = updateAvailableTimeSchema.extend({
  isActive: z.coerce.boolean()
}).omit({ 
  userId: true
});
export const availableTimeIdSchema = baseSchema.pick({ id: true });

// Types for availableTimes - used to type API request params and within Components
export type AvailableTime = z.infer<typeof availableTimeSchema>;
export type NewAvailableTime = z.infer<typeof insertAvailableTimeSchema>;
export type NewAvailableTimeParams = z.infer<typeof insertAvailableTimeParams>;
export type UpdateAvailableTimeParams = z.infer<typeof updateAvailableTimeParams>;
export type AvailableTimeId = z.infer<typeof availableTimeIdSchema>["id"];
    
// this type infers the return from getAvailableTimes() - meaning it will include any joins
export type CompleteAvailableTime = Awaited<ReturnType<typeof getAvailableTimes>>["availableTimes"][number];

