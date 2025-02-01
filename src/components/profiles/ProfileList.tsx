"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Profile, CompleteProfile } from "@/lib/db/schema/profiles";
import Modal from "@/components/shared/Modal";

import { useOptimisticProfiles } from "@/app/(app)/profiles/useOptimisticProfiles";
import { Button } from "@/components/ui/button";
import ProfileForm from "./ProfileForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (profile?: Profile) => void;

export default function ProfileList({
  profiles,
   
}: {
  profiles: CompleteProfile[];
   
}) {
  const { optimisticProfiles, addOptimisticProfile } = useOptimisticProfiles(
    profiles,
     
  );
  const [open, setOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const openModal = (profile?: Profile) => {
    setOpen(true);
    profile ? setActiveProfile(profile) : setActiveProfile(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div className="h-screen overflow-auto">
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeProfile ? "Edit Profile" : "Create Profile"}
      >
        <ProfileForm
          profile={activeProfile}
          addOptimistic={addOptimisticProfile}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticProfiles.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticProfiles.map((profile) => (
            <Profile profile={profile} key={profile.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Profile = ({
  profile,
  openModal,
}: {
  profile: CompleteProfile;
  openModal: TOpenModal;
}) => {
  const optimistic = profile.id === "optimistic";
  const deleting = profile.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("profiles")
    ? pathname
    : pathname + "/profiles/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{profile.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + profile.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No profiles
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new profile.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Profiles </Button>
      </div>
    </div>
  );
};
