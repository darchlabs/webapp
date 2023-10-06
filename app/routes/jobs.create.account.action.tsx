import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-job-cookie.server";
import { z } from "zod";
import { isHexString } from "ethers";
import { jobs } from "darchlabs";
import { ValidatePrivateKey } from "@utils/validate-private-key";

type AccountActionForm = {
  baseTo: string;
  nextTo: string;
  privateKey: string;
};

export type AccountActionData = {
  privateKey: {
    error: string;
  };
};

export const CreateJobAccountAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as AccountActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    privateKey: z.string().min(1),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      privateKey: {
        error: msgError,
      },
    } as AccountActionData;
  }

  // check if the inserted privateKey is valid
  if (!isHexString(`0x${form.privateKey}`, 32)) {
    return {
      privateKey: {
        error:
          "The privateKey entered is not valid. Please ensure that it is a valid EVM privateKey in hexadecimal format, and try again",
      },
    } as AccountActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: jobs.JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // check if the private key is valid for network
  try {
    ValidatePrivateKey(jobSession.network, form.privateKey);
  } catch (err) {
    return {
      privateKey: {
        error: `The privateKey entered is not valid for '${jobSession.network}' network. Please ensure that it is a valid privateKey, and try again`,
      },
    } as AccountActionData;
  }

  // save privateKey in session
  jobSession.privateKey = form.privateKey;
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
