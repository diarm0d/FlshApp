"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Flash, CompleteFlash } from "@/lib/db/schema/flashes";
import Modal from "@/components/shared/Modal";
import { type Profile, type ProfileId } from "@/lib/db/schema/profiles";
import { useOptimisticFlashes } from "@/app/(app)/flashes/useOptimisticFlashes";
import { Button } from "@/components/ui/button";
import FlashForm from "./FlashForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (flash?: Flash) => void;

export default function FlashList({
  flashes,
  profiles,
  profileId 
}: {
  flashes: CompleteFlash[];
  profiles: Profile[];
  profileId?: ProfileId 
}) {
  const { optimisticFlashes, addOptimisticFlash } = useOptimisticFlashes(
    flashes,
    profiles 
  );
  const [open, setOpen] = useState(false);
  const [activeFlash, setActiveFlash] = useState<Flash | null>(null);
  const openModal = (flash?: Flash) => {
    setOpen(true);
    flash ? setActiveFlash(flash) : setActiveFlash(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeFlash ? "Edit Flash" : "Create Flash"}
      >
        <FlashForm
          flash={activeFlash}
          addOptimistic={addOptimisticFlash}
          openModal={openModal}
          closeModal={closeModal}
          profiles={profiles}
        profileId={profileId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticFlashes.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticFlashes.map((flash) => (
            <Flash
              flash={flash}
              key={flash.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Flash = ({
  flash,
  openModal,
}: {
  flash: CompleteFlash;
  openModal: TOpenModal;
}) => {
  const optimistic = flash.id === "optimistic";
  const deleting = flash.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("flashes")
    ? pathname
    : pathname + "/flashes/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{flash.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + flash.id }>
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
        No flashes
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new flash.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Flashes </Button>
      </div>
    </div>
  );
};
