import * as z from "zod"
import { CompleteProfile, relatedProfileSchema, CompleteUser, relatedUserSchema } from "./index"

export const flashSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  flashImage: z.string(),
  profileId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteFlash extends z.infer<typeof flashSchema> {
  profile: CompleteProfile
  user: CompleteUser
}

/**
 * relatedFlashSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFlashSchema: z.ZodSchema<CompleteFlash> = z.lazy(() => flashSchema.extend({
  profile: relatedProfileSchema,
  user: relatedUserSchema,
}))
