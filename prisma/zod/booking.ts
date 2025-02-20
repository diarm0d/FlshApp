import * as z from "zod"
import { CompleteFlash, relatedFlashSchema, CompleteUser, relatedUserSchema } from "./index"

export const bookingSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  startTime: z.number().int(),
  endTime: z.number().int(),
  isPaid: z.boolean().nullish(),
  flashId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteBooking extends z.infer<typeof bookingSchema> {
  flash: CompleteFlash
  user: CompleteUser
}

/**
 * relatedBookingSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBookingSchema: z.ZodSchema<CompleteBooking> = z.lazy(() => bookingSchema.extend({
  flash: relatedFlashSchema,
  user: relatedUserSchema,
}))
