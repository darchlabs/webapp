import type { Provider, Job } from "./types";

export type ListJobsResponse = {
  data: Job[];
  meta: {
    statusCode: number;
  };
};

export type ListProvidersResponse = {
  data: Provider[];
  meta: {
    statusCode: number;
  };
};
