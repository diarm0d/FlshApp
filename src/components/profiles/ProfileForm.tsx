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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, X, Loader2 } from "lucide-react";

import { type Profile, insertProfileParams } from "@/lib/db/schema/profiles";
import {
  createProfileAction,
  deleteProfileAction,
  updateProfileAction,
  createProfileOnboardingAction,
} from "@/lib/actions/profiles";

import currencyCodes from "currency-codes";
import { debounce } from "lodash";

interface Place {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
    languageCode: string;
  };
}

const frequentCurrencies = ["EUR", "GBP", "CHF", "DKK", "USD"];
const currencies = currencyCodes.data
  .map((c) => ({
    code: c.code,
    name: c.currency,
  }))
  .sort((a, b) => {
    // Prioritize the frequent currencies
    const aIsFrequent = frequentCurrencies.includes(a.code);
    const bIsFrequent = frequentCurrencies.includes(b.code);

    if (aIsFrequent && !bIsFrequent) return -1;
    if (!aIsFrequent && bIsFrequent) return 1;

    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name);
  });

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
  const [formattedAddress, setFormattedAddress] = useState(
    profile?.formattedAddress ?? ""
  );
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [placeName, setPlaceName] = useState(profile?.placeName ?? "");
  const [selectedCurrency, setSelectedCurrency] = useState(
    profile?.currency ?? "Euro"
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [predictions, setPredictions] = useState<Place[]>([]);

  const [pending, startMutation] = useTransition();

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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPlaceName(input);

    if (input.length < 3) {
      setPredictions([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/autocomplete?input=${encodeURIComponent(input)}`
      );
      const data = await response.json();

      if (data?.places) {
        setPredictions(data.places);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error fetching autocomplete data:", error);
      setPredictions([]);
    }
  };

  const handleSelect = (prediction: Place) => {
    setFormattedAddress(prediction.formattedAddress);
    setPlaceName(prediction.displayName.text);
    setPredictions([]);
    setOpen(false);
  };

  const handleClear = () => {
    setPlaceName("");
    setFormattedAddress("");
    setPredictions([]);
    inputRef.current?.focus();
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-4"}>
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
          placeholder="Enter your name"
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
          Profile Bio
        </Label>
        <Input
          type="text"
          name="description"
          placeholder="Enter your bio"
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
          Session Duration (in minutes)
        </Label>
        <Input
          type="text"
          name="sessionDuration"
          placeholder="Enter session duration"
          className={cn(errors?.sessionDuration ? "ring ring-destructive" : "")}
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
      <div>
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
          <DropdownMenuContent className="w-[var(--radix-popover-trigger-width)] h-[400px] overflow-scroll">
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
        {errors?.currency ? (
          <p className="text-xs text-destructive mt-2">{errors.currency[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
          placeholder="Enter deposit amount"
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
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex w-full items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    value={placeName}
                    onChange={handleInputChange}
                    placeholder="Enter a location"
                    className="pl-9 pr-10"
                    onFocus={(e) => {
                      setOpen(true);
                      e.target.select(); // Ensures input is active
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents unexpected popover close
                      setOpen(true);
                    }}
                  />
                  {placeName && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
                      onClick={handleClear}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-[var(--radix-popover-trigger-width)]"
              align="start"
              side="top"
            >
              <Command>
                <CommandList className="overflow-scroll">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : predictions.length === 0 ? (
                    <CommandEmpty>No locations found</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {predictions.map((prediction, i) => (
                        <CommandItem
                          key={i}
                          onSelect={() => handleSelect(prediction)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {prediction.displayName.text}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {prediction.formattedAddress}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Input
              type="text"
              value={placeName}
              onChange={handleInputChange}
              placeholder="Enter a location"
              className="w-full"
            />
          </DropdownMenuTrigger>

          {predictions.length > 0 && (
            <DropdownMenuContent align="start" className="w-full">
              {predictions.map((prediction, i) => (
                <DropdownMenuItem
                  key={i}
                  className="cursor-pointer"
                  onClick={() => {
                    setFormattedAddress(prediction.formattedAddress);
                    setPlaceName(prediction.displayName.text);
                    setPredictions([]);
                  }}
                >
                  {prediction.displayName.text}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu> */}
        <input
          type="hidden"
          name="formattedAddress "
          value={formattedAddress}
        />
        <input type="hidden" name="placeName" value={placeName} />

        {formattedAddress && (
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {formattedAddress}
          </p>
        )}
        {errors?.formattedAddress ? (
          <p className="text-xs text-destructive mt-2">
            {errors.formattedAddress[0]}
          </p>
        ) : errors?.placeName ? (
          <p className="text-xs text-destructive mt-2">{errors.placeName[0]}</p>
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
