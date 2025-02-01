import { Suspense } from "react";

import Loading from "@/app/loading";
import ProfileList from "@/components/profiles/ProfileList";
import { getProfiles } from "@/lib/api/profiles/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ProfilesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Profiles</h1>
        </div>
        <Profiles />
      </div>
    </main>
  );
}

const Profiles = async () => {
  await checkAuth();

  const { profiles } = await getProfiles();
  
  return (
    <Suspense fallback={<Loading />}>
      <ProfileList profiles={profiles}  />
    </Suspense>
  );
};
