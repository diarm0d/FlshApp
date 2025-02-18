import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import {
  type AvailableTime,
  CompleteAvailableTime,
} from "@/lib/db/schema/availableTimes";
import {
  type AvailableTime,
  insertAvailableTimeParams,
} from "@/lib/db/schema/availableTimes";

import { useBackPath } from "@/components/shared/BackButton";
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

const ManyAvailableTimeForm = (
  optimisticAvailableTimes: AvailableTime[],
  addOptimistic?: TAddOptimistic
) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<AvailableTime>(insertAvailableTimeParams);

  const [isLoading, setIsLoading] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("available-times");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: AvailableTime }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      toast.success(`AvailableTime ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

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
      setErrors(
        parsedAvailableTimes
          .filter((res) => !res.success)
          .map((res) => res.error.flatten().fieldErrors)
      );
      return;
    }

    const availableTimes: UpdateAvailableTimeParams[] =
      parsedAvailableTimes.map((res, index) => ({
        ...res.data,
        id: availableTimesArray?.[index]?.id ?? "", // Ensure ID exists
        userId: availableTimesArray?.[index]?.userId ?? "",
        updatedAt: new Date(),
      }));

    setIsLoading(true);

    try {
      startMutation(async () => {
        addOptimistic &&
          availableTimes.forEach((time) => {
            addOptimistic({ data: time, action: "update" });
          });

        const results = await Promise.all(
          availableTimes.map(async (time) => {
            const error = await updateAvailableTime(time.id, time);
            return { error, time };
          })
        ).then(()=> {
          toast.success("Updated your available times!");
        })

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
        {optimisticAvailableTimes.optimisticAvailableTimes.map(
          (availableTime) => (
            <AvailableTime
              availableTime={availableTime}
              key={availableTime.id}
              isLoading={isLoading}
            />
          )
        )}
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
  isLoading
}: {
  availableTime: CompleteAvailableTime;
  isLoading: boolean
}) => {
  console.log(availableTime, typeof(availableTime));
  const mutating =  isLoading || availableTime.id === "optimistic" || availableTime.id === "delete";

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
