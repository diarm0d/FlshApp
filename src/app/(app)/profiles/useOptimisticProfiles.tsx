
import { type Profile, type CompleteProfile } from "@/lib/db/schema/profiles";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Profile>) => void;

export const useOptimisticProfiles = (
  profiles: CompleteProfile[],
  
) => {
  const [optimisticProfiles, addOptimisticProfile] = useOptimistic(
    profiles,
    (
      currentState: CompleteProfile[],
      action: OptimisticAction<Profile>,
    ): CompleteProfile[] => {
      const { data } = action;

      

      const optimisticProfile = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticProfile]
            : [...currentState, optimisticProfile];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticProfile } : item,
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

  return { addOptimisticProfile, optimisticProfiles };
};
