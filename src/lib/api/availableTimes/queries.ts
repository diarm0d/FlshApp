import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type AvailableTimeId, availableTimeIdSchema } from "@/lib/db/schema/availableTimes";

export const getAvailableTimes = async () => {
  const { session } = await getUserAuth();
  const a = await db.availableTime.findMany({ where: {userId: session?.user.id!}});
  return { availableTimes: a };
};

export const getAvailableTimesById = async (id: string) => {
  const a = await db.availableTime.findMany({ where: {userId: id}});
  return { availableTimes: a };
};

export const getAvailableTimeById = async (id: AvailableTimeId) => {
  const { session } = await getUserAuth();
  const { id: availableTimeId } = availableTimeIdSchema.parse({ id });
  const a = await db.availableTime.findFirst({
    where: { id: availableTimeId, userId: session?.user.id!}});
  return { availableTime: a };
};

