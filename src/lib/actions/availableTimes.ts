"use server";

import { revalidatePath } from "next/cache";
import {
  createAvailableTime,
  deleteAvailableTime,
  updateAvailableTime,
} from "@/lib/api/availableTimes/mutations";
import {
  AvailableTimeId,
  NewAvailableTimeParams,
  UpdateAvailableTimeParams,
  availableTimeIdSchema,
  insertAvailableTimeParams,
  updateAvailableTimeParams,
} from "@/lib/db/schema/availableTimes";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateAvailableTimes = () => revalidatePath("/available-times");

export const createAvailableTimeAction = async (input: NewAvailableTimeParams) => {
  try {
    const payload = insertAvailableTimeParams.parse(input);
    await createAvailableTime(payload);
    revalidateAvailableTimes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateAvailableTimeAction = async (input: UpdateAvailableTimeParams) => {
  try {
    const payload = updateAvailableTimeParams.parse(input);
    await updateAvailableTime(payload.id, payload);
    revalidateAvailableTimes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteAvailableTimeAction = async (input: AvailableTimeId) => {
  try {
    const payload = availableTimeIdSchema.parse({ id: input });
    await deleteAvailableTime(payload.id);
    revalidateAvailableTimes();
  } catch (e) {
    return handleErrors(e);
  }
};