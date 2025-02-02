import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProfileByIdWithFlashes } from "@/lib/api/profiles/queries";
import OptimisticProfile from "./OptimisticProfile";
import { checkAuth } from "@/lib/auth/utils";
import FlashList from "@/components/flashes/FlashList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

import TogglePublic from "../TogglePublic";
import { getUserSubscriptionPlan } from "@/lib/stripe/subscription";

export const revalidate = 0;

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
   const { profileId } = await params;
  return (
    <main className="overflow-auto">
      <Profile id={profileId} />
    </main>
  );
}

const Profile = async ({ id }: { id: string }) => {
  await checkAuth();

  const { profile, flashes } = await getProfileByIdWithFlashes(id);
  const { isSubscribed } = await getUserSubscriptionPlan();

  if (!profile) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="profiles" />
        {/* <OptimisticProfile profile={profile} /> */}
      </div>
      <div className="relative mx-4">
        <TogglePublic profile={profile} isSubscribed={Boolean(isSubscribed)} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {profile.name}&apos;s Flashes
        </h3>
        <FlashList profiles={[]} profileId={profile.id} flashes={flashes} />
      </div>
    </Suspense>
  );
};
