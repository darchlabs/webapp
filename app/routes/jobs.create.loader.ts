import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { type JobInput } from "@models/jobs/types";
import { type LoaderArgs, type LoaderFunction, json } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { job } from "@models/jobs.server";
import { type Provider } from "@models/jobs/types";

export type LoaderData = {
  job: JobInput;
  providers: Provider[];
};

export const CreateJobLoader: LoaderFunction = withCookie<JobInput>(
  "jobSession",
  getSession,
  commitSession,
  async ({ context }: LoaderArgs) => {
    // get job session
    const jobSession = context["jobSession"] as Cookie<JobInput>;

    const { data } = await job.ListProviders();

    return json(
      {
        job: jobSession.data,
        providers: data,
      },
      {
        headers: {
          "Set-Cookie": jobSession.cookie,
        },
      }
    );
  }
);
