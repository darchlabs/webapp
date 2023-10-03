import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "@models/jobs/create-job-cookie.server";
import { job } from "@models/jobs.server";
import { type JobInput } from "@models/jobs/types";
import { GetNodeUrlByNetwork } from "@utils/get-nodeurl-by-network";

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
  const jobSession: JobInput = session.get("jobSession");
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

  // create job in api
  try {
    jobSession.type = "cronjob";
    const response = await job.CreateJob(jobSession);
    if (response.meta === 400) {
      return {
        confirm: {
          error: response.data,
        },
      } as ConfirmActionData;
    }
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
