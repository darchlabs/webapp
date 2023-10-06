import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { jobs } from "darchlabs";
import { type LoaderArgs, type LoaderFunction, json } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-job-cookie.server";

export type LoaderData = {
  job: jobs.JobInput;
};

export const CreateJobLoader: LoaderFunction = withCookie<jobs.JobInput>(
  "jobSession",
  getSession,
  commitSession,
  async ({ context }: LoaderArgs) => {
    // get job session
    const jobSession = context["jobSession"] as Cookie<jobs.JobInput>;

    return json(
      {
        job: jobSession.data,
      },
      {
        headers: {
          "Set-Cookie": jobSession.cookie,
        },
      }
    );
  }
);
