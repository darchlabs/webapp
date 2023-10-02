import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { type JobInput } from "@models/jobs/types";
import { type LoaderArgs, type LoaderFunction, json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { job } from "@models/jobs.server";
import { type Provider } from "@models/jobs/types";
import { GetABI } from "@utils/get-abi";

export type LoaderData = {
  job: JobInput;
  providers: Provider[];
};

export const CreateJobAbiLoader: LoaderFunction = withCookie<JobInput>(
  "jobSession",
  getSession,
  commitSession,
  async ({ context, request }: LoaderArgs) => {
    // get job session
    let jobSession = context["jobSession"] as Cookie<JobInput>;
    const { network, address } = jobSession.data

    // get and save abi from scan
    try {
      const session = await getSession(request.headers.get("Cookie"));
      const jobSession: JobInput = session.get("jobSession");
      const abi = await GetABI(network, address);
      const abiStr = JSON.stringify(abi)
      session.set("jobSession", { ...jobSession, abi: abiStr });
      await commitSession(session);
      return redirect("/jobs/create/methods");
    } catch (err: any) {
      console.log(`Warn: ${err.message}`);
    }

    // get provider list
    const { data: providers } = await job.ListProviders();

    return json(
      {
        job: jobSession.data,
        providers,
      },
      {
        headers: {
          "Set-Cookie": jobSession.cookie,
        },
      }
    );
  }
);
