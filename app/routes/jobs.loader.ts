import { json, type LoaderFunction } from "@remix-run/node";
import type { Job, Provider } from "@models/jobs/types";
import { job } from "@models/jobs.server";

export type LoaderData = {
  jobs: Job[];
  providers: Provider[];
};

export const JobsLoader: LoaderFunction = async () => {
  const { data: jobsData } = await job.ListJobs();
  const { data: providersData } = await job.ListProviders();

  return json({ jobs: jobsData, providers: providersData });
};
