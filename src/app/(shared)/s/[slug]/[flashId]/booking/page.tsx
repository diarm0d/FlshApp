import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { CalendarX2, ClockIcon, MapPin } from "lucide-react";
import BookingForm from "@/components/bookings/BookingForm";
import { getFlashById } from "@/lib/api/flashes/queries";
import { notFound } from "next/navigation";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ flashId: string }>;
}) {
  const { flashId } = await params;
  const flash = await getFlashById(flashId);
  if (flash === null) notFound();

  return (
    <main>
      <div className="max-w-lg sm:max-w-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <Card className="max-w-[800px] w-full mx-auto">
            <CardContent className="p-6  min-h-[450px] grid md:grid-cols-[1fr,auto,1fr] gap-4">
              <div>
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    alt={flash.flash?.profile?.name}
                    src={flash.flash?.user?.image ?? undefined}
                  />
                  <AvatarFallback>{flash.flash?.profile?.name}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {flash.flash?.profile?.name}
                </p>
                <h1 className="text-xl font-semibold mt-2">
                  Tattoo of {flash.flash?.title}
                </h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {flash.flash?.description}
                </p>
                <div className="mt-5 flex flex-col gap-y-3">
                  <p className="flex items-center">
                    <CalendarX2 className="size-4 mr-2 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      January 1, 2025
                    </span>
                  </p>
                  <p className="flex items-center">
                    <ClockIcon className="size-4 mr-2 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      60 Minutes
                    </span>
                  </p>
                  <p className="flex items-center">
                    <MapPin className="size-4 mr-2 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Berlin
                    </span>
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-full w-[1px]" />
              {/* <BookingForm flashes={flash} /> */}
              <div>Booking page</div>
              <Separator orientation="vertical" className="h-full w-[1px]" />
              <div>Booking page</div>
            </CardContent>
          </Card>
        </div>
        <pre className="bg-secondary p-4 rounded-sm shadow-sm text-secondary-foreground break-all whitespace-break-spaces">
          {JSON.stringify(flash, null, 2)}
        </pre>
      </div>
    </main>
  );
}
