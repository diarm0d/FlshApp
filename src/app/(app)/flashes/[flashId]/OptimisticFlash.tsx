"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/flashes/useOptimisticFlashes";
import { type Flash } from "@/lib/db/schema/flashes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import FlashForm from "@/components/flashes/FlashForm";
import { type Profile, type ProfileId } from "@/lib/db/schema/profiles";

export default function OptimisticFlash({ 
  flash,
  profiles,
  profileId 
}: { 
  flash: Flash; 
  
  profiles: Profile[];
  profileId?: ProfileId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Flash) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticFlash, setOptimisticFlash] = useOptimistic(flash);
  const updateFlash: TAddOptimistic = (input) =>
    setOptimisticFlash({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <FlashForm
          flash={optimisticFlash}
          profiles={profiles}
        profileId={profileId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateFlash}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticFlash.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticFlash.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticFlash, null, 2)}
      </pre>
    </div>
  );
}
