"use client";
import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import {
  type AvailableTime,
  CompleteAvailableTime,
  insertAvailableTimeParams,
  UpdateAvailableTimeParams,
} from "@/lib/db/schema/availableTimes";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { updateAvailableTime } from "@/lib/api/availableTimes/mutations";
import { z } from "zod";

export enum Day {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

const ManyAvailableTimeForm = (
  optimisticAvailableTimes: CompleteAvailableTime[]
) => {
  const availableTimesArray = Object.values(optimisticAvailableTimes);
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<AvailableTime>(insertAvailableTimeParams);

  const [isLoading, setIsLoading] = useState(false);
  const [, startMutation] = useTransition();

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());

    const availabilityData = Object.keys(payload)
      .filter((key) => key.startsWith("id-"))
      .map((key) => {
        const id = key.replace("id-", "");

        return {
          id,
          day: payload[`day-${id}`] as string,
          isActive: payload[`isActive-${id}`] === "on",
          fromTime: payload[`fromTime-${id}`] as string,
          tillTime: payload[`tillTime-${id}`] as string,
        };
      });

    const availableTimesArray = Object.values(availabilityData);
    const parsedAvailableTimes = await Promise.all(
      availableTimesArray.map((time) =>
        insertAvailableTimeParams.safeParseAsync(time)
      )
    );

    const failedValidation = parsedAvailableTimes.some((res) => !res.success);
    if (failedValidation) {
      const zodErrors = parsedAvailableTimes
        .filter((res) => !res.success)
        .map((res) => res.error.flatten().fieldErrors)
        // Reduce the array of error objects into a single object
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      setErrors(zodErrors); // Set the combined errors

      return;
    }

    const availableTimes: UpdateAvailableTimeParams[] =
      parsedAvailableTimes.map((res, index) => ({
        ...res.data,
        id: availableTimesArray?.[index]?.id ?? "",
        day: res.data?.day ?? Day.Monday,
        fromTime: res.data?.fromTime ?? "09:00",
        tillTime: res.data?.tillTime ?? "17:00",
        isActive: res.data?.isActive ?? false,
        updatedAt: new Date(),
      }));

    setIsLoading(true);

    try {
      startMutation(async () => {
        const results = await Promise.all(
          availableTimes.map(async (time) => {
            const error = await updateAvailableTime(time.id, time);
            return { error, time };
          })
        ).then(() => {
          toast.success("Updated your available times!");
        });

        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      } else {
        toast.error("Something went wrong, please try again");
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      <div>
        {availableTimesArray?.map((availableTime) => (
          <AvailableTime
            availableTime={availableTime}
            key={availableTime.id}
            isLoading={isLoading}
          />
        ))}
      </div>
      <SaveButton errors={hasErrors} />
      {errors && (
        <p className="text-xs text-destructive mt-2">
          {JSON.stringify(errors)}
        </p>
      )}
    </form>
  );
};

export default ManyAvailableTimeForm;

const AvailableTime = ({
  availableTime,
  isLoading,
}: {
  availableTime: CompleteAvailableTime;
  isLoading: boolean;
}) => {
  const mutating =
    isLoading ||
    availableTime.id === "optimistic" ||
    availableTime.id === "delete";

  return (
    <>
      <div
        className={cn(
          "my-4",
          mutating ? "opacity-30 animate-pulse" : "",
          availableTime.id === "delete" ? "text-destructive" : ""
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
          <input
            type="hidden"
            name={`day-${availableTime.id}`}
            value={availableTime.day}
          />
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
      </div>
    </>
  );
};

const SaveButton = ({ errors }: { errors: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={pending || errors}
      aria-disabled={pending || errors}
    >
      {`Creat${pending ? "ing..." : "e"}`}
    </Button>
  );
};
