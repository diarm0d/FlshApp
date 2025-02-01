import { Suspense } from "react";

import Loading from "@/app/loading";
import FlashList from "@/components/flashes/FlashList";
import { getFlashes } from "@/lib/api/flashes/queries";
import { getProfiles } from "@/lib/api/profiles/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function FlashesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Flashes</h1>
        </div>
        <Flashes />
      </div>
    </main>
  );
}

const Flashes = async () => {
  await checkAuth();

  const { flashes } = await getFlashes();
  const { profiles } = await getProfiles();
  return (
    <Suspense fallback={<Loading />}>
      <FlashList flashes={flashes} profiles={profiles} />
    </Suspense>
  );
};
