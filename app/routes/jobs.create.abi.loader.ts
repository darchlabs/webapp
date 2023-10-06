import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { jobs } from "darchlabs";
import { type LoaderArgs, type LoaderFunction, json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-job-cookie.server";
import { GetABI } from "@utils/get-abi";

export type LoaderData = {
  job: jobs.JobInput;
};

export const CreateJobAbiLoader: LoaderFunction = withCookie<jobs.JobInput>(
  "jobSession",
  getSession,
  commitSession,
  async ({ context, request }: LoaderArgs) => {
    // get job session
    let jobSession = context["jobSession"] as Cookie<jobs.JobInput>;
    const { network, address } = jobSession.data

    // get and save abi from scan
    try {
      const session = await getSession(request.headers.get("Cookie"));
      const jobSession: jobs.JobInput = session.get("jobSession");
      const abi = await GetABI(network, address);
      const abiStr = JSON.stringify(abi)
      session.set("jobSession", { ...jobSession, abi: abiStr });
      await commitSession(session);
      return redirect("/jobs/create/methods");
    } catch (err: any) {
      console.log(`Warn: ${err.message}`);
    }

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
