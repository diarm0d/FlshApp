import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getAvailableTimeById } from "@/lib/api/availableTimes/queries";
import OptimisticAvailableTime from "./OptimisticAvailableTime";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function AvailableTimePage({
  params,
}: {
  params: { availableTimeId: string };
}) {

  return (
    <main className="overflow-auto">
      <AvailableTime id={params.availableTimeId} />
    </main>
  );
}

const AvailableTime = async ({ id }: { id: string }) => {
  await checkAuth();

  const { availableTime } = await getAvailableTimeById(id);
  

  if (!availableTime) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="available-times" />
        <OptimisticAvailableTime availableTime={availableTime}  />
      </div>
    </Suspense>
  );
};
