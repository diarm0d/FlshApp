import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookingById } from "@/lib/api/bookings/queries";
import { getFlashes } from "@/lib/api/flashes/queries";import OptimisticBooking from "./OptimisticBooking";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BookingPage({
  params,
}: {
  params: { bookingId: string };
}) {

  return (
    <main className="overflow-auto">
      <Booking id={params.bookingId} />
    </main>
  );
}

const Booking = async ({ id }: { id: string }) => {
  await checkAuth();

  const { booking } = await getBookingById(id);
  const { flashes } = await getFlashes();

  if (!booking) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="bookings" />
        <OptimisticBooking booking={booking} flashes={flashes} />
      </div>
    </Suspense>
  );
};
