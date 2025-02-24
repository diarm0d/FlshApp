import { bookingSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getBookings } from "@/lib/api/bookings/queries";


// Schema for bookings - used to validate API requests
const baseSchema = bookingSchema.omit(timestamps)

export const insertBookingSchema = baseSchema.omit({ id: true });
export const insertBookingParams = baseSchema.extend({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isPaid: z.coerce.boolean(),
  flashId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updateBookingSchema = baseSchema;
export const updateBookingParams = updateBookingSchema.extend({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isPaid: z.coerce.boolean(),
  flashId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const bookingIdSchema = baseSchema.pick({ id: true });

// Types for bookings - used to type API request params and within Components
export type Booking = z.infer<typeof bookingSchema>;
export type NewBooking = z.infer<typeof insertBookingSchema>;
export type NewBookingParams = z.infer<typeof insertBookingParams>;
export type UpdateBookingParams = z.infer<typeof updateBookingParams>;
export type BookingId = z.infer<typeof bookingIdSchema>["id"];
    
// this type infers the return from getBookings() - meaning it will include any joins
export type CompleteBooking = Awaited<ReturnType<typeof getBookings>>["bookings"][number];

