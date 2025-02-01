import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type FlashId, flashIdSchema } from "@/lib/db/schema/flashes";

export const getFlashes = async () => {
  const { session } = await getUserAuth();
  const f = await db.flash.findMany({ where: {userId: session?.user.id!}, include: { profile: true}});
  return { flashes: f };
};

export const getFlashById = async (id: FlashId) => {
  const { session } = await getUserAuth();
  const { id: flashId } = flashIdSchema.parse({ id });
  const f = await db.flash.findFirst({
    where: { id: flashId, userId: session?.user.id!},
    include: { profile: true }
  });
  return { flash: f };
};


