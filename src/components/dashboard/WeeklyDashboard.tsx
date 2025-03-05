"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, isSameDay } from "date-fns";
import { useState } from "react";

type Booking = {
  id: string;
  name: string;
  email: string;
  startTime: string;
  endTime: string;
  isPaid: boolean;
  flashId: string;
  flash: {
    id: string;
    name: string;
  };
};

type WeeklyCalendarProps = {
  bookings: Booking[];
  days: Date[];
};

export function WeeklyCalendar({ bookings, days }: WeeklyCalendarProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getBookingsForDayAndHour = (day: Date, hour: number) => {
    return bookings.filter((booking) => {
      const startTime = parseISO(booking.startTime as unknown as string);
      const bookingHour = startTime.getHours();
      return isSameDay(startTime, day) && bookingHour === hour;
    });
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Weekly Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-center font-medium text-muted-foreground">
            Time
          </div>
          {days.map((day, i) => (
            <div key={i} className="p-2 text-center font-medium">
              <div>{format(day, "EEE")}</div>
              <div className="text-muted-foreground text-sm">
                {format(day, "d MMM")}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          {hours.map((hour) => (
            <>
              <div
                key={`hour-${hour}`}
                className="p-2 text-center border-r text-sm text-muted-foreground"
              >
                {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
              </div>
              {days.map((day, dayIndex) => {
                const dayBookings = getBookingsForDayAndHour(day, hour);
                return (
                  <div
                    key={`cell-${dayIndex}-${hour}`}
                    className="p-1 min-h-[60px] border-b border-r relative"
                  >
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded cursor-pointer mb-1 ${
                          booking.isPaid ? "bg-green-100" : "bg-yellow-100"
                        }`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {booking.name.split(" ")[0]}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {selectedBooking && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="bg-white p-4 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2">{selectedBooking.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {selectedBooking.email}
              </p>
              <p className="mb-2">
                <span className="font-medium">Time:</span>{" "}
                {format(
                  parseISO(selectedBooking.startTime as unknown as string),
                  "h:mm a"
                )}{" "}
                -
                {format(
                  parseISO(selectedBooking.endTime as unknown as string),
                  "h:mm a"
                )}
              </p>
              <p className="mb-2">
                <span className="font-medium">Flash:</span>{" "}
                {selectedBooking.flash.name}
              </p>
              <p className="mb-4">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    selectedBooking.isPaid
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {selectedBooking.isPaid ? "Paid" : "Pending Payment"}
                </span>
              </p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
