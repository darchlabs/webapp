import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { z } from "zod";
import { type JobInput } from "@models/jobs/types";

type ProviderActionForm = {
  baseTo: string;
  nextTo: string;
  providerId: string;
};

export type ProviderActionData = {
  providerId?: {
    error?: string;
  };
};

export const CreateJobProviderAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as ProviderActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string().min(1),
    nextTo: z.string().min(1),
    providerId: z.string().min(1),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      network: {
        error: msgError,
      },
    } as ProviderActionData;
  }

  // upsert to create cookie
  const session = await getSession(request.headers.get("Cookie"));
  const jobInput: JobInput = session.get("jobSession");

  // set provider value in cookie
  jobInput.providerId = form.providerId;
  session.set("jobSession", jobInput);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = form.nextTo ? `/${form.baseTo}/create/${form.nextTo}` : form.baseTo;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
