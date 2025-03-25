"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createBookingAction } from "@/lib/api/bookings/mutations";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { CompleteFlash } from "@/lib/db/schema/flashes";

interface Props {
  time: string;
  date: string;
  profileUrl: string;
  flash: CompleteFlash;
}

export const AptForm = ({ time, date, profileUrl, flash }: Props) => {
  const [isPaid, setIsPaid] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formData, setFormData] = useState(new FormData());

  console.log("flash", flash);

  return (
    <div style={{ colorScheme: "none" }}>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
          currency: "EUR",
        }}
      >
        <form action={createBookingAction} className="flex flex-col gap-y-4">
          <input type="hidden" name="fromTime" value={time} />
          <input type="hidden" name="eventDate" value={date} />
          <input type="hidden" name="redirectUrl" value={profileUrl} />
          <input type="hidden" name="orderId" value={orderId} />
          <input
            type="hidden"
            name="isPaid"
            value={isPaid ? "true" : "false"}
          />
          <input
            type="hidden"
            name="meetingLength"
            value={flash?.profile?.sessionDuration}
          />
          <input type="hidden" name="userId" value={flash.userId} />
          <input type="hidden" name="flashId" value={flash.id} />
          <input type="hidden" name="flashTitle" value={flash.title} />
          <input
            type="hidden"
            name="location"
            value={`${flash.profile.placeName}, ${flash.profile.formattedAddress}`}
          />

          <div className="flex flex-col gap-y-2">
            <Label>Your Name</Label>
            <Input name="name" placeholder="Enter your name" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Your Email</Label>
            <Input name="email" placeholder="Enter your email" />
          </div>
          {!isPaid ? (
            <PayPalButtons
              createOrder={async () => {
                const res = await fetch("/api/paypal", {
                  method: "POST",
                  body: JSON.stringify({ amount: flash.profile.depositAmount }),
                  headers: { "Content-Type": "application/json" },
                });

                try {
                  const data = await res.json();

                  if (!data.orderID) {
                    throw new Error("PayPal API response missing orderID");
                  }

                  return data.orderID;
                } catch (err) {
                  console.error("Failed to parse JSON:", err);
                  throw new Error("Invalid response from PayPal API");
                }
              }}
              onApprove={async (data) => {
                setIsPaid(true);
                setOrderId(data.orderID);
                await createBookingAction(formData);
              }}
              onCancel={() => {
                setIsPaid(false);
                setOrderId("");
              }}
              onError={() => {
                setIsPaid(false);
                setOrderId("");
              }}
            />
          ) : (
            <Button type="submit" className="w-full mt-5 bg-green-500">
              Complete Booking
            </Button>
          )}
        </form>
      </PayPalScriptProvider>
    </div>
  );
};
