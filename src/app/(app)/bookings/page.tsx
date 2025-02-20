import { Suspense } from "react";

import Loading from "@/app/loading";
import BookingList from "@/components/bookings/BookingList";
import { getBookings } from "@/lib/api/bookings/queries";
import { getFlashes } from "@/lib/api/flashes/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function BookingsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Bookings</h1>
        </div>
        <Bookings />
      </div>
    </main>
  );
}

const Bookings = async () => {
  await checkAuth();

  const { bookings } = await getBookings();
  const { flashes } = await getFlashes();
  return (
    <Suspense fallback={<Loading />}>
      <BookingList bookings={bookings} flashes={flashes} />
    </Suspense>
  );
};
