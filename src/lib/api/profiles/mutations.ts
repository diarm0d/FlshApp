import { db } from "@/lib/db/index";
import {
  ProfileId,
  NewProfileParams,
  UpdateProfileParams,
  updateProfileSchema,
  insertProfileSchema,
  profileIdSchema,
} from "@/lib/db/schema/profiles";
import { getUserAuth } from "@/lib/auth/utils";

export const createProfile = async (profile: NewProfileParams) => {
  const { session } = await getUserAuth();
  const newProfile = insertProfileSchema.parse({
    ...profile,
    userId: session?.user.id!,
  });
  try {
    const p = await db.profile.create({ data: newProfile });
    return { profile: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const createProfileWithAvailability = async (
  profile: NewProfileParams
) => {
  const { session } = await getUserAuth();
  const newProfile = insertProfileSchema.parse({
    ...profile,
    userId: session?.user.id,
  });
  try {
    const p = await db.profile.create({ data: newProfile });

    await db.availableTime.createMany({
      data: [
        {
          userId: session?.user.id,
          day: "Monday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
        {
          userId: session?.user.id,
          day: "Tuesday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
        {
          userId: session?.user.id,
          day: "Wednesday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
        {
          userId: session?.user.id,
          day: "Thursday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
        {
          userId: session?.user.id,
          day: "Friday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
        {
          userId: session?.user.id,
          day: "Saturday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
        {
          userId: session?.user.id,
          day: "Sunday",
          fromTime: "09:00",
          tillTime: "18:00",
        },
      ],
    });
    return { profile: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateProfile = async (
  id: ProfileId,
  profile: UpdateProfileParams
) => {
  const { session } = await getUserAuth();
  const { id: profileId } = profileIdSchema.parse({ id });
  const newProfile = updateProfileSchema.parse({
    ...profile,
    userId: session?.user.id!,
  });
  try {
    const p = await db.profile.update({
      where: { id: profileId, userId: session?.user.id! },
      data: newProfile,
    });
    return { profile: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteProfile = async (id: ProfileId) => {
  const { session } = await getUserAuth();
  const { id: profileId } = profileIdSchema.parse({ id });
  try {
    const p = await db.profile.delete({
      where: { id: profileId, userId: session?.user.id! },
    });
    return { profile: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
