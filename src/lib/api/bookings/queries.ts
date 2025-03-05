import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type BookingId, bookingIdSchema } from "@/lib/db/schema/bookings";
import { startOfMonth, endOfMonth, addWeeks } from "date-fns";

export const getBookings = async () => {
  const { session } = await getUserAuth();
  const b = await db.booking.findMany({
    where: { userId: session?.user.id! },
    include: { flash: true },
  });
  return { bookings: b };
};

export const getBookingById = async (id: BookingId) => {
  const { session } = await getUserAuth();
  const { id: bookingId } = bookingIdSchema.parse({ id });
  const b = await db.booking.findFirst({
    where: { id: bookingId, userId: session?.user.id! },
    include: { flash: true },
  });
  return { booking: b };
};

export const getBookingsByTwoWeeks = async () => {
  const { session } = await getUserAuth();

  const today = new Date();
  const twoWeeksFromNow = addWeeks(today, 2);

  const b = await db.booking.findMany({
    where: {
      startTime: {
        gte: today, // Greater than or equal to today
        lte: twoWeeksFromNow, // Less than or equal to two weeks from now
      },
      userId: session?.user.id!,
    },
    include: { flash: true },
    orderBy: {
      startTime: 'asc'
    }
  });
  return { bookings: b };
};

export const getBookingsThisMonth = async () => {
  const { session } = await getUserAuth();

  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);
  const endOfCurrentMonth = endOfMonth(today);

  const bookings = await db.booking.findMany({
    where: {
      startTime: {
        gte: startOfCurrentMonth, // Start of this month
        lte: endOfCurrentMonth,   // End of this month
      },
      userId: session?.user.id!,
    },
    include: { flash: true },
    orderBy: {
      startTime: 'asc'
    }
  });

  return { bookings };
};

export const getLatestBookings = async () => {
  const { session } = await getUserAuth();

  const bookings = await db.booking.findMany({
    where: {
      userId: session?.user.id!,
    },
    include: { flash: true },
    orderBy: {
      createdAt: 'desc', // Order by latest createdAt
    },
    take: 5, // Limit to 5 latest bookings
  });

  return { bookings };
};
