import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getFlashById } from "@/lib/api/flashes/queries";
import { getProfiles } from "@/lib/api/profiles/queries";import OptimisticFlash from "@/app/(app)/flashes/[flashId]/OptimisticFlash";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function FlashPage({
  params,
}: {
  params: Promise<{ flashId: string }>;
}) {
  const { flashId } = await params;
  return (
    <main className="overflow-auto">
      <Flash id={flashId} />
    </main>
  );
}

const Flash = async ({ id }: { id: string }) => {
  await checkAuth();

  const { flash } = await getFlashById(id);
  const { profiles } = await getProfiles();

  if (!flash) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="flashes" />
        <OptimisticFlash flash={flash} profiles={profiles}
        profileId={flash.profileId} />
      </div>
    </Suspense>
  );
};
