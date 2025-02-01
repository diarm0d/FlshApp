import { type Profile } from "@/lib/db/schema/profiles";
import { type Flash, type CompleteFlash } from "@/lib/db/schema/flashes";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Flash>) => void;

export const useOptimisticFlashes = (
  flashes: CompleteFlash[],
  profiles: Profile[]
) => {
  const [optimisticFlashes, addOptimisticFlash] = useOptimistic(
    flashes,
    (
      currentState: CompleteFlash[],
      action: OptimisticAction<Flash>,
    ): CompleteFlash[] => {
      const { data } = action;

      const optimisticProfile = profiles.find(
        (profile) => profile.id === data.profileId,
      )!;

      const optimisticFlash = {
        ...data,
        profile: optimisticProfile,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticFlash]
            : [...currentState, optimisticFlash];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticFlash } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticFlash, optimisticFlashes };
};
