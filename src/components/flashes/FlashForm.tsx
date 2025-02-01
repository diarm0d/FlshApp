"use client";
import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/flashes/useOptimisticFlashes";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Flash, insertFlashParams } from "@/lib/db/schema/flashes";
import {
  createFlashAction,
  deleteFlashAction,
  updateFlashAction,
} from "@/lib/actions/flashes";
import { type Profile, type ProfileId } from "@/lib/db/schema/profiles";

import { UploadDropzone } from "@/lib/uploadthing/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

const FlashForm = ({
  profiles,
  profileId,
  flash,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  flash?: Flash | null;
  profiles: Profile[];
  profileId?: ProfileId;
  openModal?: (flash?: Flash) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Flash>(insertFlashParams);
  const editing = !!flash?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [flashImage, setFlashImage] = useState<string>(flash?.flashImage ?? "");
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("flashes");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Flash }
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
      toast.success(`Flash ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleDeleteImage = () => {
    setFlashImage("");
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const flashParsed = await insertFlashParams.safeParseAsync({
      profileId,
      ...payload,
    });
    if (!flashParsed.success) {
      setErrors(flashParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = flashParsed.data;
    const pendingFlash: Flash = {
      updatedAt: flash?.updatedAt ?? new Date(),
      createdAt: flash?.createdAt ?? new Date(),
      id: flash?.id ?? "",
      userId: flash?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingFlash,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateFlashAction({ ...values, id: flash.id })
          : await createFlashAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingFlash,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
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
            errors?.title ? "text-destructive" : ""
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? "ring ring-destructive" : "")}
          defaultValue={flash?.title ?? ""}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.description ? "text-destructive" : ""
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={flash?.description ?? ""}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-4 inline-block",
            errors?.flashImage ? "text-destructive" : ""
          )}
        >
          Flash Image
        </Label>
        <Input
          type="hidden"
          name="flashImage"
          className={cn(errors?.flashImage ? "ring ring-destructive" : "")}
          defaultValue={flashImage}
        />
        {flashImage ? (
          <div className="relative size-16">
            <Image
              src={flashImage}
              alt="Flash Image"
              className="size-16 rounded-lg"
              width={64}
              height={64}
            />
            <Button
              onClick={handleDeleteImage}
              variant="destructive"
              size="icon"
              type="button"
              className="absolute -top-3 -right-3 size-6"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setFlashImage(res[0].url);
              toast.success("Image uploaded successfully");
            }}
            onUploadError={(err) => {
              console.log(err);
              toast.error("Something went wrong");
            }}
          />
        )}
        {errors?.flashImage ? (
          <p className="text-xs text-destructive mt-2">
            {errors.flashImage[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {profileId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.profileId ? "text-destructive" : ""
            )}
          >
            Profile
          </Label>
          <Select defaultValue={flash?.profileId} name="profileId">
            <SelectTrigger
              className={cn(errors?.profileId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles?.map((profile) => (
                <SelectItem key={profile.id} value={profile.id.toString()}>
                  {profile.id}
                  {/* TODO: Replace with a field from the profile model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.profileId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.profileId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
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
              addOptimistic && addOptimistic({ action: "delete", data: flash });
              const error = await deleteFlashAction(flash.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: flash,
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

export default FlashForm;

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
