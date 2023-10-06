import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "@models/darchlabs/create-job-cookie.server";
import { jobs } from "darchlabs";
import { GetNodeUrlByNetwork } from "@utils/get-nodeurl-by-network";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type ConfirmActionForm = {
  baseTo: string;
  nextTo: string;
};

export type ConfirmActionData = {
  confirm: {
    error?: string;
  };
};

export const CreateJobConfirmAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as ConfirmActionForm;

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: jobs.JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // TODO(ca): implement this in backend 
  jobSession.providerId = "1";
  const nodeUrl = GetNodeUrlByNetwork(jobSession.network)
  if (!nodeUrl) {
    return redirect("/jobs/create")
  }
  jobSession.nodeUrl = nodeUrl;
  jobSession.type = "cronjob";

  // create job in api
  try {
    const client = await GetDarchlabsClient(request);
    await client.jobs.createJob(jobSession);
  } catch (err: any) {
    return {
      confirm: {
        error: "Sorry, something went wrong on the server, please try again later",
      },
    } as ConfirmActionData;
  }

  // redirect and destroy session
  return redirect(`/${form.baseTo}`, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
