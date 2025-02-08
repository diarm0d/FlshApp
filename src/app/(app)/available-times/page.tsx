import { Suspense } from "react";

import Loading from "@/app/loading";
import AvailableTimeList from "@/components/availableTimes/AvailableTimeList";
import { getAvailableTimes } from "@/lib/api/availableTimes/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function AvailableTimesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Available Times</h1>
        </div>
        <AvailableTimes />
      </div>
    </main>
  );
}

const AvailableTimes = async () => {
  await checkAuth();

  const { availableTimes } = await getAvailableTimes();
  
  return (
    <Suspense fallback={<Loading />}>
      <AvailableTimeList availableTimes={availableTimes}  />
    </Suspense>
  );
};
