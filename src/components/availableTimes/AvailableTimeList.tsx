"use client";
import {
  type AvailableTime,
  CompleteAvailableTime,
} from "@/lib/db/schema/availableTimes";

import { useOptimisticAvailableTimes } from "@/app/(app)/available-times/useOptimisticAvailableTimes";
import ManyAvailableTimeForm from "./ManyAvailableTimeForm";

export default function AvailableTimeList({
  availableTimes,
}: {
  availableTimes: CompleteAvailableTime[];
}) {
  const { optimisticAvailableTimes, addOptimisticAvailableTime } =
    useOptimisticAvailableTimes(availableTimes);


  return (
    <>
      {optimisticAvailableTimes.length === 0 ? (
        <EmptyState />
      ) : (
        <ManyAvailableTimeForm
          optimisticAvailableTimes={availableTimes}
          addOptimistic={addOptimisticAvailableTime}
        />
      )}
    </>
  );
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No available times
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Please complete the onboarding to create a new available time.
      </p>
    </div>
  );
};
