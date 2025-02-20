import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/bookings/useOptimisticBookings";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Booking, insertBookingParams } from "@/lib/db/schema/bookings";
import {
  createBookingAction,
  deleteBookingAction,
  updateBookingAction,
} from "@/lib/actions/bookings";
import { type Flash, type FlashId } from "@/lib/db/schema/flashes";

const BookingForm = ({
  flashes,
  flashId,
  booking,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  booking?: Booking | null;
  flashes: Flash[];
  flashId?: FlashId
  openModal?: (booking?: Booking) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Booking>(insertBookingParams);
  const editing = !!booking?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("bookings");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Booking },
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
      toast.success(`Booking ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const bookingParsed = await insertBookingParams.safeParseAsync({ flashId, ...payload });
    if (!bookingParsed.success) {
      setErrors(bookingParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = bookingParsed.data;
    const pendingBooking: Booking = {
      updatedAt: booking?.updatedAt ?? new Date(),
      createdAt: booking?.createdAt ?? new Date(),
      id: booking?.id ?? "",
      userId: booking?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingBooking,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateBookingAction({ ...values, id: booking.id })
          : await createBookingAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBooking 
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
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={booking?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.email ? "text-destructive" : "",
          )}
        >
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? "ring ring-destructive" : "")}
          defaultValue={booking?.email ?? ""}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.startTime ? "text-destructive" : "",
          )}
        >
          Start Time
        </Label>
        <Input
          type="text"
          name="startTime"
          className={cn(errors?.startTime ? "ring ring-destructive" : "")}
          defaultValue={booking?.startTime ?? ""}
        />
        {errors?.startTime ? (
          <p className="text-xs text-destructive mt-2">{errors.startTime[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.endTime ? "text-destructive" : "",
          )}
        >
          End Time
        </Label>
        <Input
          type="text"
          name="endTime"
          className={cn(errors?.endTime ? "ring ring-destructive" : "")}
          defaultValue={booking?.endTime ?? ""}
        />
        {errors?.endTime ? (
          <p className="text-xs text-destructive mt-2">{errors.endTime[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
<div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.isPaid ? "text-destructive" : "",
          )}
        >
          Is Paid
        </Label>
        <br />
        <Checkbox defaultChecked={booking?.isPaid} name={'isPaid'} className={cn(errors?.isPaid ? "ring ring-destructive" : "")} />
        {errors?.isPaid ? (
          <p className="text-xs text-destructive mt-2">{errors.isPaid[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {flashId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.flashId ? "text-destructive" : "",
          )}
        >
          Flash
        </Label>
        <Select defaultValue={booking?.flashId} name="flashId">
          <SelectTrigger
            className={cn(errors?.flashId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a flash" />
          </SelectTrigger>
          <SelectContent>
          {flashes?.map((flash) => (
            <SelectItem key={flash.id} value={flash.id.toString()}>
              {flash.id}{/* TODO: Replace with a field from the flash model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.flashId ? (
          <p className="text-xs text-destructive mt-2">{errors.flashId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
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
              addOptimistic && addOptimistic({ action: "delete", data: booking });
              const error = await deleteBookingAction(booking.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: booking,
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

export default BookingForm;

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
