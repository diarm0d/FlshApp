"use server";
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
import { redirect } from "next/navigation";
import { nylas } from "@/lib/nylas/nylas"
import { Timespan } from "nylas";

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

export async function createBookingAction(formData: FormData) {
  const userData = await db.user.findUnique({
    where: {
      id: formData.get("userId") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }


  const customTitle = `${formData.get("name")} | ${formData.get("flashName")}`;

  const fromTime = formData.get("fromTime") as string;
  const eventDate = formData.get("eventDate") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const provider = formData.get("provider");

  const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  await nylas.events.create({
    identifier: userData?.grantId as string,
    requestBody: {
      title: customTitle,
      description: formData.get("flashName") as string,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      } as Timespan,
      participants: [
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: userData.grantEmail as string,
      notifyParticipants: true,
    },
  });
  return redirect("/success");
}

