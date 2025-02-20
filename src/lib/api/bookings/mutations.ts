import { db } from "@/lib/db/index";
import { 
  BookingId, 
  NewBookingParams,
  UpdateBookingParams, 
  updateBookingSchema,
  insertBookingSchema, 
  bookingIdSchema 
} from "@/lib/db/schema/bookings";
import { getUserAuth } from "@/lib/auth/utils";

export const createBooking = async (booking: NewBookingParams) => {
  const { session } = await getUserAuth();
  const newBooking = insertBookingSchema.parse({ ...booking, userId: session?.user.id! });
  try {
    const b = await db.booking.create({ data: newBooking });
    return { booking: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBooking = async (id: BookingId, booking: UpdateBookingParams) => {
  const { session } = await getUserAuth();
  const { id: bookingId } = bookingIdSchema.parse({ id });
  const newBooking = updateBookingSchema.parse({ ...booking, userId: session?.user.id! });
  try {
    const b = await db.booking.update({ where: { id: bookingId, userId: session?.user.id! }, data: newBooking})
    return { booking: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBooking = async (id: BookingId) => {
  const { session } = await getUserAuth();
  const { id: bookingId } = bookingIdSchema.parse({ id });
  try {
    const b = await db.booking.delete({ where: { id: bookingId, userId: session?.user.id! }})
    return { booking: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

