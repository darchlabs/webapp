import { json, LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { jobs } from "darchlabs";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server"
import { AuthData, withAuth } from "@middlewares/with-auth";

export type LoaderData = {
  jobs: jobs.Job[];
  auth: AuthData;
};

export const JobsLoader: LoaderFunction = withAuth(async ({ context, request }: LoaderArgs) => {
  // get jobs from darchlabs
  let jobs: jobs.Job[];
  try {
    const client = await GetDarchlabsClient(request);
    (jobs = await client.jobs.listJobs())
  } catch (err) {
    throw err
  }

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json({ jobs, auth });
});
