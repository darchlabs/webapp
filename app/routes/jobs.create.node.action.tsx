import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-job-cookie.server";
import { z } from "zod";
import { ValidateClient } from "@utils/validate-client";
import { jobs } from "darchlabs";

type NodeActionForm = {
  baseTo: string;
  nextTo: string;
  nodeUrl: string;
};

export type NodeActionData = {
  nodeUrl: {
    error?: string;
  };
};

export const CreateJobsNodeAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NodeActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    nodeUrl: z.string().min(1),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      nodeUrl: {
        error: msgError,
      },
    } as NodeActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: jobs.JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // check if node url is valid client for the network
  try {
    await ValidateClient(jobSession.network, form.nodeUrl);
  } catch (err: any) {
    return {
      nodeUrl: {
        error: err.message,
      },
    } as NodeActionData;
  }

  // save node url in session
  jobSession.nodeUrl = form.nodeUrl;
  session.set("jobSession", jobSession);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = form.nextTo ? `/${form.baseTo}/create/${form.nextTo}` : form.baseTo;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
