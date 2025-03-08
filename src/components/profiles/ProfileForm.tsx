import { z } from "zod";

import { useState, useTransition, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/profiles/useOptimisticProfiles";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Profile, insertProfileParams } from "@/lib/db/schema/profiles";
import {
  createProfileAction,
  deleteProfileAction,
  updateProfileAction,
  createProfileOnboardingAction,
} from "@/lib/actions/profiles";

import { LoadScript, Autocomplete } from "@react-google-maps/api";
import currencyCodes from "currency-codes";

const libraries: "places"[] = ["places"];
const currencies = currencyCodes.data.map((c) => ({
  code: c.code,
  name: c.currency,
}));

const ProfileForm = ({
  profile,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
  onboarding = false,
}: {
  profile?: Profile | null;

  openModal?: (profile?: Profile) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
  onboarding?: boolean;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Profile>(insertProfileParams);
  const editing = !!profile?.id;

  const [userName, setUserName] = useState(profile?.name ?? "");
  const [slug, setSlug] = useState(profile?.slug ?? "");
  const [placeId, setPlaceId] = useState(profile?.placeId ?? "");
  const [placeName, setPlaceName] = useState(profile?.placeName ?? "");
  const [selectedCurrency, setSelectedCurrency] = useState(
    profile?.currency ?? currencies[0].name
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autocomplete) {
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.place_id && place.formatted_address) {
          setPlaceId(place.place_id);
          setPlaceName(place.formatted_address);
        }
      });
    }
  }, [autocomplete, placeId, placeName]);

  const router = useRouter();
  const backpath = useBackPath("profiles");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Profile }
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
      toast.success(`Profile ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ""); // Remove special characters
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
    setSlug(generateSlug(value)); // Update slug automatically
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const profileParsed = await insertProfileParams.safeParseAsync({
      ...payload,
    });
    if (!profileParsed.success) {
      setErrors(profileParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = profileParsed.data;
    const pendingProfile: Profile = {
      updatedAt: profile?.updatedAt ?? new Date(),
      createdAt: profile?.createdAt ?? new Date(),
      id: profile?.id ?? "",
      userId: profile?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingProfile,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateProfileAction({ ...values, id: profile.id })
          : onboarding
          ? await createProfileOnboardingAction(values)
          : await createProfileAction(values);

        if (onboarding && !error) {
          router.push("/onboarding/calendar");
        }

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingProfile,
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
    <LoadScript
      googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY ?? ""}
      libraries={libraries}
    >
      <form
        action={handleSubmit}
        onChange={handleChange}
        className={"space-y-8"}
      >
        {/* Schema fields start */}
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.name ? "text-destructive" : ""
            )}
          >
            Username
          </Label>
          <Input
            type="text"
            name="name"
            className={cn(errors?.name ? "ring ring-destructive" : "")}
            value={userName}
            onChange={(e) => handleUserNameChange(e)}
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
              errors?.slug ? "text-destructive" : ""
            )}
          >
            Slug
          </Label>
          <div className="flex rounder-md">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
              flsh.app/s/
            </span>
            <Input
              type="text"
              name="slug"
              className={cn(
                errors?.slug
                  ? "ring ring-destructive rounded-l-none"
                  : "rounded-l-none"
              )}
              readOnly
              value={slug}
            />
          </div>
          {errors?.slug ? (
            <p className="text-xs text-destructive mt-2">{errors.slug[0]}</p>
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
            defaultValue={profile?.description ?? ""}
          />
          {errors?.description ? (
            <p className="text-xs text-destructive mt-2">
              {errors.description[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
        {/* <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.profileImage ? "text-destructive" : "",
          )}
        >
          Profile Image
        </Label>
        <Input
          type="text"
          name="profileImage"
          className={cn(errors?.profileImage ? "ring ring-destructive" : "")}
          defaultValue={profile?.profileImage ?? ""}
        />
        {errors?.profileImage ? (
          <p className="text-xs text-destructive mt-2">{errors.profileImage[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> */}
        {/* <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.public ? "text-destructive" : "",
          )}
        >
          Public
        </Label>
        <br />
        <Checkbox defaultChecked={profile?.public} name={'public'} className={cn(errors?.public ? "ring ring-destructive" : "")} />
        {errors?.public ? (
          <p className="text-xs text-destructive mt-2">{errors.public[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> */}
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.sessionDuration ? "text-destructive" : ""
            )}
          >
            Session Duration
          </Label>
          <Input
            type="text"
            name="sessionDuration"
            className={cn(
              errors?.sessionDuration ? "ring ring-destructive" : ""
            )}
            defaultValue={profile?.sessionDuration ?? ""}
          />
          {errors?.sessionDuration ? (
            <p className="text-xs text-destructive mt-2">
              {errors.sessionDuration[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.depositAmount ? "text-destructive" : ""
          )}
        >
          Currency
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedCurrency}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px]">
            {currencies.map((currency) => (
              <DropdownMenuItem
                key={currency.code}
                onSelect={() => {
                  setSelectedCurrency(currency.name);
                }}
              >
                {currency.name} ({currency.code})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <input type="hidden" name="currency" value={selectedCurrency} />
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.depositAmount ? "text-destructive" : ""
            )}
          >
            Deposit Amount
          </Label>
          <Input
            type="text"
            name="depositAmount"
            className={cn(errors?.depositAmount ? "ring ring-destructive" : "")}
            defaultValue={profile?.depositAmount ?? ""}
          />
          {errors?.depositAmount ? (
            <p className="text-xs text-destructive mt-2">
              {errors.depositAmount[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.slug ? "text-destructive" : ""
            )}
          >
            Business Name / Location
          </Label>
          <Autocomplete
            className="w-full"
            onLoad={(auto) => setAutocomplete(auto)}
            onPlaceChanged={() => {
              if (autocomplete) {
                const place = autocomplete.getPlace();
                if (place.place_id && place.formatted_address) {
                  setPlaceId(place.place_id);
                  setPlaceName(place.formatted_address);
                }
              }
            }}
          >
            <Input
              className="w-full"
              ref={inputRef}
              type="text"
              placeholder="Search for a place"
            />
          </Autocomplete>
        </div>
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="placeName" value={placeName} />
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
                addOptimistic &&
                  addOptimistic({ action: "delete", data: profile });
                const error = await deleteProfileAction(profile.id);
                setIsDeleting(false);
                const errorFormatted = {
                  error: error ?? "Error",
                  values: profile,
                };

                onSuccess("delete", error ? errorFormatted : undefined);
              });
            }}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </LoadScript>
  );
};

export default ProfileForm;

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
