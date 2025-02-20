"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/bookings/useOptimisticBookings";
import { type Booking } from "@/lib/db/schema/bookings";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BookingForm from "@/components/bookings/BookingForm";
import { type Flash, type FlashId } from "@/lib/db/schema/flashes";

export default function OptimisticBooking({ 
  booking,
  flashes,
  flashId 
}: { 
  booking: Booking; 
  
  flashes: Flash[];
  flashId?: FlashId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Booking) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBooking, setOptimisticBooking] = useOptimistic(booking);
  const updateBooking: TAddOptimistic = (input) =>
    setOptimisticBooking({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BookingForm
          booking={optimisticBooking}
          flashes={flashes}
        flashId={flashId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBooking}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticBooking.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticBooking.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticBooking, null, 2)}
      </pre>
    </div>
  );
}
