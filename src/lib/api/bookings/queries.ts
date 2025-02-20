import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type BookingId, bookingIdSchema } from "@/lib/db/schema/bookings";

export const getBookings = async () => {
  const { session } = await getUserAuth();
  const b = await db.booking.findMany({ where: {userId: session?.user.id!}, include: { flash: true}});
  return { bookings: b };
};

export const getBookingById = async (id: BookingId) => {
  const { session } = await getUserAuth();
  const { id: bookingId } = bookingIdSchema.parse({ id });
  const b = await db.booking.findFirst({
    where: { id: bookingId, userId: session?.user.id!},
    include: { flash: true }
  });
  return { booking: b };
};


