import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { CalendarX2, ClockIcon, MapPin } from "lucide-react";
import { getFlashById } from "@/lib/api/flashes/queries";
import { notFound } from "next/navigation";
import { getAvailableTimesById } from "@/lib/api/availableTimes/queries";
import { CalendarWrapper } from "@/components/calendar/CalendarWrapper";
import Image from "next/image";
import TimeTable from "@/components/calendar/TimeTable";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ flashId: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const { flashId } = await params;
  const flash = await getFlashById(flashId);
  if (flash === null) notFound();
  const { availableTimes } = await getAvailableTimesById(
    flash.flash?.userId ?? ""
  );

  const { date, time } = await searchParams;
  const selectedDate = date ? new Date(date) : new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const showForm = !!date && !!time;

  return (
    <main>
      <div className="max-w-lg sm:max-w-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          {showForm ? (
            <Card className="max-w-[800px] w-full mx-auto">
              <CardContent className="p-6  min-h-[450px] grid md:grid-cols-[1fr,auto,1fr] gap-4">
                <div>
                  <div className="flex items-center justify-center">
                    <div className="w-lg sm:mw-xl">
                      <Image
                        alt={flash.flash?.title ?? ""}
                        className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                        height={150}
                        src={flash.flash?.flashImage ?? ""}
                        width={150}
                      />
                    </div>
                  </div>
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      alt={flash.flash?.profile?.name}
                      src={flash.flash?.user?.image ?? undefined}
                    />
                    <AvatarFallback>
                      {flash.flash?.profile?.name}
                    </AvatarFallback>
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
                <form className="flex flex-col gap-y-4">
                  {/* <input type="hidden" name="fromTime" value={time} />
                <input type="hidden" name="eventDate" value={date} />
                <input
                  type="hidden"
                  name="meetingLength"
                  value={data.duration}
                />
                <input type="hidden" name="userName" value={username} />
                <input type="hidden" name="eventTypeId" value={data.id} />
                <input
                  type="hidden"
                  name="provider"
                  value={data.videoCallSoftware}
                /> */}
                  <div className="flex flex-col gap-y-2">
                    <Label>Your Name</Label>
                    <Input name="name" placeholder="Your name" />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label>Your Email</Label>
                    <Input name="email" placeholder="johndoe@example.com" />
                  </div>
                  <Button type="submit" className="w-full mt-5">
                    Book Appointment
                  </Button>
                </form>
                <div>Booking page</div>
                <Separator orientation="vertical" className="h-full w-[1px]" />
                <div>Booking page</div>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-[1000px] w-full mx-auto">
              <CardContent className="p-10 min-h-[450px] grid grid-cols-1">
                <div>
                  <div className="flex items-center">
                    <div className="w-lg sm:mw-xl">
                      <Image
                        alt={flash.flash?.title ?? ""}
                        className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                        height={150}
                        src={flash.flash?.flashImage ?? ""}
                        width={150}
                      />
                    </div>
                    <div className="ml-8">
                      <h1 className="text-xl font-semibold mt-2">
                        Tattoo of {flash.flash?.title}
                      </h1>
                      <p className="text-sm font-medium text-muted-foreground mt-1">
                        By {flash.flash?.profile?.name}
                      </p>
                      <div className="mt-5 flex flex-col gap-y-3">
                        <p className="flex items-center">
                          <CalendarX2 className="size-4 mr-2 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {formattedDate}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <ClockIcon className="size-4 mr-2 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {flash.flash?.profile?.sessionDuration} Minutes
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
                  </div>
                </div>
                <Separator
                  orientation="horizontal"
                  className="w-full h-[1px] my-8"
                />
                <div className="px-4 flex justify-center">
                  <CalendarWrapper availability={availableTimes} />
                </div>
                <Separator
                  orientation="horizontal"
                  className="w-full h-[1px] my-8"
                />
                <div className="px-4">
                  <TimeTable
                    userId={flash.flash?.userId ?? ""}
                    selectedDate={selectedDate}
                    duration={flash.flash?.profile?.sessionDuration ?? 240}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {/* <pre className="bg-secondary p-4 rounded-sm shadow-sm text-secondary-foreground break-all whitespace-break-spaces">
          {JSON.stringify(flash, null, 2)}
        </pre> */}
      </div>
    </main>
  );
}
