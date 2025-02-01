import { profileSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getProfiles } from "@/lib/api/profiles/queries";


// Schema for profiles - used to validate API requests
const baseSchema = profileSchema.omit(timestamps)

export const insertProfileSchema = baseSchema.omit({ id: true });
export const insertProfileParams = baseSchema.extend({
  public: z.coerce.boolean(),
  sessionDuration: z.coerce.number(),
  depositAmount: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateProfileSchema = baseSchema;
export const updateProfileParams = updateProfileSchema.extend({
  public: z.coerce.boolean(),
  sessionDuration: z.coerce.number(),
  depositAmount: z.coerce.number()
}).omit({ 
  userId: true
});
export const profileIdSchema = baseSchema.pick({ id: true });

// Types for profiles - used to type API request params and within Components
export type Profile = z.infer<typeof profileSchema>;
export type NewProfile = z.infer<typeof insertProfileSchema>;
export type NewProfileParams = z.infer<typeof insertProfileParams>;
export type UpdateProfileParams = z.infer<typeof updateProfileParams>;
export type ProfileId = z.infer<typeof profileIdSchema>["id"];
    
// this type infers the return from getProfiles() - meaning it will include any joins
export type CompleteProfile = Awaited<ReturnType<typeof getProfiles>>["profiles"][number];

