import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/available-times/useOptimisticAvailableTimes";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import { Checkbox } from "@/components/ui/checkbox"

import { type AvailableTime, insertAvailableTimeParams } from "@/lib/db/schema/availableTimes";
import {
  createAvailableTimeAction,
  deleteAvailableTimeAction,
  updateAvailableTimeAction,
} from "@/lib/actions/availableTimes";


const AvailableTimeForm = ({
  
  availableTime,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  availableTime?: AvailableTime | null;
  
  openModal?: (availableTime?: AvailableTime) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<AvailableTime>(insertAvailableTimeParams);
  const editing = !!availableTime?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("available-times");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: AvailableTime },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`AvailableTime ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const availableTimeParsed = await insertAvailableTimeParams.safeParseAsync({  ...payload });
    if (!availableTimeParsed.success) {
      setErrors(availableTimeParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = availableTimeParsed.data;
    const pendingAvailableTime: AvailableTime = {
      updatedAt: availableTime?.updatedAt ?? new Date(),
      createdAt: availableTime?.createdAt ?? new Date(),
      id: availableTime?.id ?? "",
      userId: availableTime?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingAvailableTime,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateAvailableTimeAction({ ...values, id: availableTime.id })
          : await createAvailableTimeAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingAvailableTime 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.day ? "text-destructive" : "",
          )}
        >
          Day
        </Label>
        <Input
          type="text"
          name="day"
          className={cn(errors?.day ? "ring ring-destructive" : "")}
          defaultValue={availableTime?.day ?? ""}
        />
        {errors?.day ? (
          <p className="text-xs text-destructive mt-2">{errors.day[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.fromTime ? "text-destructive" : "",
          )}
        >
          From Time
        </Label>
        <Input
          type="text"
          name="fromTime"
          className={cn(errors?.fromTime ? "ring ring-destructive" : "")}
          defaultValue={availableTime?.fromTime ?? ""}
        />
        {errors?.fromTime ? (
          <p className="text-xs text-destructive mt-2">{errors.fromTime[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.tillTime ? "text-destructive" : "",
          )}
        >
          Till Time
        </Label>
        <Input
          type="text"
          name="tillTime"
          className={cn(errors?.tillTime ? "ring ring-destructive" : "")}
          defaultValue={availableTime?.tillTime ?? ""}
        />
        {errors?.tillTime ? (
          <p className="text-xs text-destructive mt-2">{errors.tillTime[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
<div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.isActive ? "text-destructive" : "",
          )}
        >
          Is Active
        </Label>
        <br />
        <Checkbox defaultChecked={availableTime?.isActive} name={'isActive'} className={cn(errors?.isActive ? "ring ring-destructive" : "")} />
        {errors?.isActive ? (
          <p className="text-xs text-destructive mt-2">{errors.isActive[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: availableTime });
              const error = await deleteAvailableTimeAction(availableTime.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: availableTime,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default AvailableTimeForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
