"use server";

import { revalidatePath } from "next/cache";
import {
  createBooking,
  deleteBooking,
  updateBooking,
} from "@/lib/api/bookings/mutations";
import {
  BookingId,
  NewBookingParams,
  UpdateBookingParams,
  bookingIdSchema,
  insertBookingParams,
  updateBookingParams,
} from "@/lib/db/schema/bookings";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBookings = () => revalidatePath("/bookings");

export const createBookingAction = async (input: NewBookingParams) => {
  try {
    const payload = insertBookingParams.parse(input);
    await createBooking(payload);
    revalidateBookings();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBookingAction = async (input: UpdateBookingParams) => {
  try {
    const payload = updateBookingParams.parse(input);
    await updateBooking(payload.id, payload);
    revalidateBookings();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBookingAction = async (input: BookingId) => {
  try {
    const payload = bookingIdSchema.parse({ id: input });
    await deleteBooking(payload.id);
    revalidateBookings();
  } catch (e) {
    return handleErrors(e);
  }
};