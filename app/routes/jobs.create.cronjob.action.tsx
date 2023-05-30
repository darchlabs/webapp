import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { z } from "zod";
import cron from "cron-validate";
import { type JobInput } from "@models/jobs/types";

type CronjobActionForm = {
  baseTo: string;
  nextTo: string;
  cronjob: string;
};

export type CronjobActionData = {
  cronjob: {
    error: string;
  };
};

export const CreateJobCronjobAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as CronjobActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    cronjob: z.string(),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      cronjob: {
        error: msgError,
      },
    } as CronjobActionData;
  }

  // check if cronjob is valid
  const cronResult = cron(form.cronjob, {
    preset: "npm-cron-schedule",
  });
  if (!cronResult.isValid()) {
    return {
      cronjob: {
        error: "The cronjob entered is not valid",
      },
    } as CronjobActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // save cronjob in session
  jobSession.cronjob = form.cronjob;
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
