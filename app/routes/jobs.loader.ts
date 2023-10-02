import { json, LoaderArgs, type LoaderFunction } from "@remix-run/node";
import type { Job, Provider } from "@models/jobs/types";
import { job } from "@models/jobs.server";
import { AuthData, withAuth } from "@middlewares/with-auth";

export type LoaderData = {
  jobs: Job[];
  providers: Provider[];
  auth: AuthData;
};

export const JobsLoader: LoaderFunction = withAuth(async ({ context }: LoaderArgs) => {
  const { data: jobsData } = await job.ListJobs();
  const { data: providersData } = await job.ListProviders();

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json({ jobs: jobsData, providers: providersData, auth });
});
