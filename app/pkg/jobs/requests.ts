import type { Provider, Job } from "./types";

export type ListJobsResponse = {
  data: Job[];
  meta: number;
};

export type ListProvidersResponse = {
  data: Provider[];
  meta: number;
};

export type CreateJobResponse = {
  data: Job | string;
  meta: number;
};
