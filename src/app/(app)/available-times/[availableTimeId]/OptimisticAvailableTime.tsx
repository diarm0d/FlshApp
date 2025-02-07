"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/available-times/useOptimisticAvailableTimes";
import { type AvailableTime } from "@/lib/db/schema/availableTimes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import AvailableTimeForm from "@/components/availableTimes/AvailableTimeForm";


export default function OptimisticAvailableTime({ 
  availableTime,
   
}: { 
  availableTime: AvailableTime; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: AvailableTime) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticAvailableTime, setOptimisticAvailableTime] = useOptimistic(availableTime);
  const updateAvailableTime: TAddOptimistic = (input) =>
    setOptimisticAvailableTime({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <AvailableTimeForm
          availableTime={optimisticAvailableTime}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateAvailableTime}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticAvailableTime.day}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticAvailableTime.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticAvailableTime, null, 2)}
      </pre>
    </div>
  );
}
