import { db } from "@/lib/db/index";
import { 
  FlashId, 
  NewFlashParams,
  UpdateFlashParams, 
  updateFlashSchema,
  insertFlashSchema, 
  flashIdSchema 
} from "@/lib/db/schema/flashes";
import { getUserAuth } from "@/lib/auth/utils";

export const createFlash = async (flash: NewFlashParams) => {
  const { session } = await getUserAuth();
  const newFlash = insertFlashSchema.parse({ ...flash, userId: session?.user.id! });
  try {
    const f = await db.flash.create({ data: newFlash });
    return { flash: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateFlash = async (id: FlashId, flash: UpdateFlashParams) => {
  const { session } = await getUserAuth();
  const { id: flashId } = flashIdSchema.parse({ id });
  const newFlash = updateFlashSchema.parse({ ...flash, userId: session?.user.id! });
  try {
    const f = await db.flash.update({ where: { id: flashId, userId: session?.user.id! }, data: newFlash})
    return { flash: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteFlash = async (id: FlashId) => {
  const { session } = await getUserAuth();
  const { id: flashId } = flashIdSchema.parse({ id });
  try {
    const f = await db.flash.delete({ where: { id: flashId, userId: session?.user.id! }})
    return { flash: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

