import * as z from "zod"
import { Day } from "@prisma/client"
import { CompleteUser, relatedUserSchema } from "./index"

export const availableTimeSchema = z.object({
  id: z.string(),
  day: z.nativeEnum(Day),
  fromTime: z.string(),
  tillTime: z.string(),
  isActive: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteAvailableTime extends z.infer<typeof availableTimeSchema> {
  user: CompleteUser
}

/**
 * relatedAvailableTimeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedAvailableTimeSchema: z.ZodSchema<CompleteAvailableTime> = z.lazy(() => availableTimeSchema.extend({
  user: relatedUserSchema,
}))
