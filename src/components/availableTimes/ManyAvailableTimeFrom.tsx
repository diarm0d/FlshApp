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

const ManyAvailableTimeForm = (
  optimisticAvailableTimes: AvailableTime[]
) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<AvailableTime>(insertAvailableTimeParams);

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("available-times");

  const handleSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      <ul>
        {optimisticAvailableTimes.optimisticAvailableTimes.map(
          (availableTime) => (
            <AvailableTime
              availableTime={availableTime}
              key={availableTime.id}
            />
          )
        )}
      </ul>
      <SaveButton errors={hasErrors} />
    </form>
  );
};

export default ManyAvailableTimeForm;

const AvailableTime = ({
  availableTime,
}: {
  availableTime: CompleteAvailableTime;
}) => {
  const optimistic = availableTime.id === "optimistic";
  const deleting = availableTime.id === "delete";
  const mutating = optimistic || deleting;

  return (
    <>
      <li
        className={cn(
          "my-4",
          mutating ? "opacity-30 animate-pulse" : "",
          deleting ? "text-destructive" : ""
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
      </li>
    </>
  );
};

const SaveButton = ({
  errors,
}: {
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={pending || errors}
      aria-disabled={pending || errors}
    >
      {`Creat${pending? "ing..." : "e"}`}
    </Button>
  );
};
