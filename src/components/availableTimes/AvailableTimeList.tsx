"use client";
import { CompleteAvailableTime } from "@/lib/db/schema/availableTimes";

import ManyAvailableTimeForm from "./ManyAvailableTimeForm";

export default function AvailableTimeList({
  availableTimes,
}: {
  availableTimes: CompleteAvailableTime[];
}) {
  return (
    <>
      {availableTimes.length === 0 ? (
        <EmptyState />
      ) : (
        <ManyAvailableTimeForm {...availableTimes} />
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
