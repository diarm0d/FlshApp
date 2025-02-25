"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Booking, CompleteBooking } from "@/lib/db/schema/bookings";
import Modal from "@/components/shared/Modal";
import { type Flash, type FlashId } from "@/lib/db/schema/flashes";
import { useOptimisticBookings } from "@/app/(app)/bookings/useOptimisticBookings";
import { Button } from "@/components/ui/button";
import BookingForm from "./BookingForm";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

type TOpenModal = (booking?: Booking) => void;

export default function BookingList({
  bookings,
  flashes,
  flashId 
}: {
  bookings: CompleteBooking[];
  flashes: Flash[];
  flashId?: FlashId 
}) {
  const { optimisticBookings, addOptimisticBooking } = useOptimisticBookings(
    bookings,
    flashes 
  );
  const [open, setOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const openModal = (booking?: Booking) => {
    setOpen(true);
    booking ? setActiveBooking(booking) : setActiveBooking(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBooking ? "Edit Booking" : "Create Booking"}
      >
        <BookingForm
          booking={activeBooking}
          addOptimistic={addOptimisticBooking}
          openModal={openModal}
          closeModal={closeModal}
          flashes={flashes}
        flashId={flashId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        {/* <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button> */}
      </div>
      {optimisticBookings.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBookings.map((booking) => (
            <Booking
              booking={booking}
              key={booking.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Booking = ({
  booking,
  openModal,
}: {
  booking: CompleteBooking;
  openModal: TOpenModal;
}) => {
  const optimistic = booking.id === "optimistic";
  const deleting = booking.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("bookings")
    ? pathname
    : pathname + "/bookings/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div
        key={booking.id}
        className="flex items-center w-full gap-4 p-4 rounded-lg border bg-card"
      >
        <div className="relative h-16 w-16 rounded-md overflow-hidden">
          <Image
            src={booking.flash.flashImage}
            alt={booking.flash.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg">{booking.flash.title}</h3>
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">
              {booking.name} • {booking.email}
            </p>
            <p className="text-sm">
              {format(new Date(booking.startTime), "h:mm a")} -{" "}
              {format(new Date(booking.endTime), "h:mm a")}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="w-full">
        <div>{booking.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + booking.id }>
          Edit
        </Link>
      </Button> */}
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No bookings
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new booking.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Bookings </Button>
      </div>
    </div>
  );
};
