
import { type AvailableTime, type CompleteAvailableTime } from "@/lib/db/schema/availableTimes";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<AvailableTime>) => void;

export const useOptimisticAvailableTimes = (
  availableTimes: CompleteAvailableTime[],
  
) => {
  const [optimisticAvailableTimes, addOptimisticAvailableTime] = useOptimistic(
    availableTimes,
    (
      currentState: CompleteAvailableTime[],
      action: OptimisticAction<AvailableTime>,
    ): CompleteAvailableTime[] => {
      const { data } = action;

      

      const optimisticAvailableTime = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticAvailableTime]
            : [...currentState, optimisticAvailableTime];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticAvailableTime } : item,
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

  return { addOptimisticAvailableTime, optimisticAvailableTimes };
};
