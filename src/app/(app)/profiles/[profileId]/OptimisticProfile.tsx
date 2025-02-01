"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/profiles/useOptimisticProfiles";
import { type Profile } from "@/lib/db/schema/profiles";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ProfileForm from "@/components/profiles/ProfileForm";


export default function OptimisticProfile({ 
  profile,
   
}: { 
  profile: Profile; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Profile) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticProfile, setOptimisticProfile] = useOptimistic(profile);
  const updateProfile: TAddOptimistic = (input) =>
    setOptimisticProfile({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ProfileForm
          profile={optimisticProfile}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProfile}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticProfile.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticProfile.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticProfile, null, 2)}
      </pre>
    </div>
  );
}
