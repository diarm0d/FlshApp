import * as z from "zod"
import { CompleteAccount, relatedAccountSchema, CompleteSession, relatedSessionSchema, CompleteProfile, relatedProfileSchema, CompleteFlash, relatedFlashSchema, CompleteSubscription, relatedSubscriptionSchema, CompleteAvailableTime, relatedAvailableTimeSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  profiles: CompleteProfile[]
  flashes: CompleteFlash[]
  subscription?: CompleteSubscription | null
  availableTimes: CompleteAvailableTime[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  accounts: relatedAccountSchema.array(),
  sessions: relatedSessionSchema.array(),
  profiles: relatedProfileSchema.array(),
  flashes: relatedFlashSchema.array(),
  subscription: relatedSubscriptionSchema.nullish(),
  availableTimes: relatedAvailableTimeSchema.array(),
}))
