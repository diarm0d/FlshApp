import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteFlash, relatedFlashSchema } from "./index"

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  public: z.boolean(),
  sessionDuration: z.number().int(),
  currency: z.string(),
  depositAmount: z.number().int(),
  placeId: z.string(),
  placeName: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProfile extends z.infer<typeof profileSchema> {
  user: CompleteUser
  flashes: CompleteFlash[]
}

/**
 * relatedProfileSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProfileSchema: z.ZodSchema<CompleteProfile> = z.lazy(() => profileSchema.extend({
  user: relatedUserSchema,
  flashes: relatedFlashSchema.array(),
}))
