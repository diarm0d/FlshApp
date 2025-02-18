"use server";
import { db } from "@/lib/db/index";
import {
  AvailableTimeId,
  NewAvailableTimeParams,
  UpdateAvailableTimeParams,
  updateAvailableTimeSchema,
  insertAvailableTimeSchema,
  availableTimeIdSchema,
} from "@/lib/db/schema/availableTimes";
import { getUserAuth } from "@/lib/auth/utils";

export const createAvailableTime = async (
  availableTime: NewAvailableTimeParams
) => {
  const { session } = await getUserAuth();
  const newAvailableTime = insertAvailableTimeSchema.parse({
    ...availableTime,
    userId: session?.user.id!,
  });
  try {
    const a = await db.availableTime.create({ data: newAvailableTime });
    return { availableTime: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateAvailableTime = async (
  id: AvailableTimeId,
  availableTime: UpdateAvailableTimeParams
) => {
  const { session } = await getUserAuth();
  console.log("Raw id before parsing:", id, availableTime);

  const { id: availableTimeId } = availableTimeIdSchema.parse({ id });
  const newAvailableTime = updateAvailableTimeSchema.parse({
    ...availableTime,
    userId: session?.user.id!,
  });
  try {
    const a = await db.availableTime.update({
      where: { id: availableTimeId, userId: session?.user.id! },
      data: newAvailableTime,
    });
    return a;
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteAvailableTime = async (id: AvailableTimeId) => {
  const { session } = await getUserAuth();
  const { id: availableTimeId } = availableTimeIdSchema.parse({ id });
  try {
    const a = await db.availableTime.delete({
      where: { id: availableTimeId, userId: session?.user.id! },
    });
    return { availableTime: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
