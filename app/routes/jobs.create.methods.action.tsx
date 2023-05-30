import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { z } from "zod";
import { type JobInput } from "@models/jobs/types";

type MethodsActionForm = {
  baseTo: string;
  nextTo: string;
  checkMethod: string;
  actionMethod: string;
};

export type MethodsActionData = {
  checkMethod: {
    error?: string;
  };
  actionMethod: {
    error?: string;
  };
};

export const CreateJobMethodsAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as MethodsActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    checkMethod: z.string().min(1),
    actionMethod: z.string().min(1),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    if (result.error.errors.length > 0) {
      const errors: MethodsActionData = { checkMethod: {}, actionMethod: {} };
      for (let i = 0; i < result.error.errors.length; i++) {
        const {
          path: [method],
        } = result.error.errors[i];
        if (method === "checkMethod" || method === "actionMethod") {
          errors[method].error = `Invalid value for ${method}`;
        }
      }

      return errors;
    }
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // save in session
  jobSession.checkMethod = form.checkMethod;
  jobSession.actionMethod = form.actionMethod;
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
