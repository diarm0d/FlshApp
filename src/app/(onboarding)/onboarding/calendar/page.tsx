"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import Image from "next/image";

const CalGif = "/calgif.gif"; 

export default function OnboardingCalPage() {
  return (
    <div className="h-screen overflow-auto w-screen flex items-center justify-center">
      <Card className="h-3/4 w-[450px] overflow-auto">
        <CardHeader>
          <CardTitle>Your are almost done!</CardTitle>
          <CardDescription>
            Please connect your calendar to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={CalGif}
            alt="almost done"
            className="rounded-md w-full mb-4"
            width={420}
            height={420}
          />
          <Button asChild className="w-full">
            <Link href="/api/auth">
              Connect Calendar
              <CalendarCheck2 className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
