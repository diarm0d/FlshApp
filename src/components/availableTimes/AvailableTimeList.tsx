"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type AvailableTime,
  CompleteAvailableTime,
} from "@/lib/db/schema/availableTimes";
import Modal from "@/components/shared/Modal";

import { useOptimisticAvailableTimes } from "@/app/(app)/available-times/useOptimisticAvailableTimes";
import { Button } from "@/components/ui/button";
import AvailableTimeForm from "./AvailableTimeForm";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { times } from "@/lib/utils";

type TOpenModal = (availableTime?: AvailableTime) => void;

export default function AvailableTimeList({
  availableTimes,
}: {
  availableTimes: CompleteAvailableTime[];
}) {
  const { optimisticAvailableTimes, addOptimisticAvailableTime } =
    useOptimisticAvailableTimes(availableTimes);
  const [open, setOpen] = useState(false);
  const [activeAvailableTime, setActiveAvailableTime] =
    useState<AvailableTime | null>(null);
  const openModal = (availableTime?: AvailableTime) => {
    setOpen(true);
    availableTime
      ? setActiveAvailableTime(availableTime)
      : setActiveAvailableTime(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeAvailableTime ? "Edit AvailableTime" : "Create Available Time"
        }
      >
        <AvailableTimeForm
          availableTime={activeAvailableTime}
          addOptimistic={addOptimisticAvailableTime}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        {/* <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button> */}
      </div>
      {optimisticAvailableTimes.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticAvailableTimes.map((availableTime) => (
            <AvailableTime
              availableTime={availableTime}
              key={availableTime.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const AvailableTime = ({
  availableTime,
  openModal,
}: {
  availableTime: CompleteAvailableTime;
  openModal: TOpenModal;
}) => {
  const optimistic = availableTime.id === "optimistic";
  const deleting = availableTime.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("available-times")
    ? pathname
    : pathname + "/available-times/";

  return (
    <>
      {/* <li
        className={cn(
          "flex justify-between my-2",
          mutating ? "opacity-30 animate-pulse" : "",
          deleting ? "text-destructive" : ""
        )}
      >
        <div className="w-full">
          <div>{availableTime.day}</div>
        </div>
        <Button variant={"link"} asChild>
          <Link href={basePath + "/" + availableTime.id}>Edit</Link>
        </Button>
      </li> */}
      <li
        className={cn(
          "my-4",
          mutating ? "opacity-30 animate-pulse" : "",
          deleting ? "text-destructive" : ""
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
          <div className="flex items-center gap-x-3">
            <input
              type="hidden"
              name={`id-${availableTime.id}`}
              value={availableTime.id}
            />
            <Switch
              name={`isActive-${availableTime.id}`}
              defaultChecked={availableTime.isActive}
            />
            <p>{availableTime.day}</p>
          </div>

          <Select
            name={`fromTime-${availableTime.id}`}
            defaultValue={availableTime.fromTime}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="From Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {times.map((time) => (
                  <SelectItem value={time.time} key={time.id}>
                    {time.time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            name={`tillTime-${availableTime.id}`}
            defaultValue={availableTime.tillTime}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Till Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {times.map((time) => (
                  <SelectItem value={time.time} key={time.id}>
                    {time.time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </li>
    </>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No available times
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new available time.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Available Times{" "}
        </Button>
      </div>
    </div>
  );
};
