"use server";

import { revalidatePath } from "next/cache";
import {
  createProfile,
  deleteProfile,
  updateProfile,
} from "@/lib/api/profiles/mutations";
import {
  ProfileId,
  NewProfileParams,
  UpdateProfileParams,
  profileIdSchema,
  insertProfileParams,
  updateProfileParams,
} from "@/lib/db/schema/profiles";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateProfiles = () => revalidatePath("/profiles");

export const createProfileAction = async (input: NewProfileParams) => {
  try {
    const payload = insertProfileParams.parse(input);
    await createProfile(payload);
    revalidateProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateProfileAction = async (input: UpdateProfileParams) => {
  try {
    const payload = updateProfileParams.parse(input);
    await updateProfile(payload.id, payload);
    revalidateProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteProfileAction = async (input: ProfileId) => {
  try {
    const payload = profileIdSchema.parse({ id: input });
    await deleteProfile(payload.id);
    revalidateProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};