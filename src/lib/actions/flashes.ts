"use server";

import { revalidatePath } from "next/cache";
import {
  createFlash,
  deleteFlash,
  updateFlash,
} from "@/lib/api/flashes/mutations";
import {
  FlashId,
  NewFlashParams,
  UpdateFlashParams,
  flashIdSchema,
  insertFlashParams,
  updateFlashParams,
} from "@/lib/db/schema/flashes";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateFlashes = () => revalidatePath("/flashes");

export const createFlashAction = async (input: NewFlashParams) => {
  try {
    const payload = insertFlashParams.parse(input);
    await createFlash(payload);
    revalidateFlashes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateFlashAction = async (input: UpdateFlashParams) => {
  try {
    const payload = updateFlashParams.parse(input);
    await updateFlash(payload.id, payload);
    revalidateFlashes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteFlashAction = async (input: FlashId) => {
  try {
    const payload = flashIdSchema.parse({ id: input });
    await deleteFlash(payload.id);
    revalidateFlashes();
  } catch (e) {
    return handleErrors(e);
  }
};