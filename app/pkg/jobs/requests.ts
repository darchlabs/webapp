import type { Provider, Job } from "./types";

export type ListJobsResponse = {
  data: Job[];
<<<<<<< HEAD
  meta: number;
=======
  meta: {
    statusCode: number;
  };
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
};

export type ListProvidersResponse = {
  data: Provider[];
<<<<<<< HEAD
  meta: number;
};

export type CreateJobResponse = {
  data: Job | string;
  meta: number;
=======
  meta: {
    statusCode: number;
  };
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
};
