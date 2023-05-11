import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { z } from "zod";
import { GetAbiSchema } from "@utils/get-abi-schema";
import { type JobInput } from "@models/jobs/types";
import { ValidateContractAbi } from "@utils/validate-contract-abi";

type AbiActionForm = {
  baseTo: string;
  nextTo: string;
  abi: string;
};

export type AbiActionData = {
  abi: {
    error: string;
  };
};

export const CreateJobAbiAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as AbiActionForm;

  // parse abi string to json
  let abi;
  try {
    abi = JSON.parse(form.abi);
  } catch (err) {
    return {
      abi: {
        error: "Invalid JSON",
      },
    } as AbiActionData;
  }

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    abi: GetAbiSchema(),
  });

  // validate with schema
  const result = subscriberSchema.safeParse({
    baseTo: form.baseTo,
    nextTo: form.nextTo,
    abi,
  });

  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "Invalid inserted ABI format, please check the JSON";

    return {
      abi: {
        error: msgError,
      },
    } as AbiActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // // check if abi is valid for the network
  // try {
  //   ValidateContractAbi(jobSession.network, jobSession.address, JSON.stringify(abi));
  // } catch (err) {
  //   return {
  //     abi: {
  //       error: `The abi is not valid for address/networkd. Please try again.`,
  //     },
  //   } as AbiActionData;
  // }

  // save abi in session
  jobSession.abi = JSON.stringify(abi);
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
