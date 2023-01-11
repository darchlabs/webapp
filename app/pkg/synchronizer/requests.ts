import type { Synchronizer } from "./types";
import type { Cronjob } from "../../types";

export type ListEventsResponse = {
  data: Synchronizer[];
  meta: {
    cronjob: Cronjob;
  };
};
