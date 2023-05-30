import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/jobs/create-job-cookie.server";
import { z } from "zod";
import { isAddress } from "ethers";
import { type JobInput } from "@models/jobs/types";
import { ValidateAddressContractInNetwork } from "@utils/validate-address-contract-in-network";

type AddressActionForm = {
  baseTo: string;
  nextTo: string;
  address: string;
};

export type AddressActionData = {
  address: {
    error: string;
  };
};

export const CreateJobAddressAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as AddressActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    address: z.string().min(1),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      address: {
        error: msgError,
      },
    } as AddressActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const jobSession: JobInput = session.get("jobSession");
  if (!jobSession) {
    return redirect("/jobs/create");
  }

  // // check if address is valid for network
  // try {
  //   ValidateAddressContractInNetwork(jobSession.network, form.address);
  // } catch (err: any) {
  //   return {
  //     address: {
  //       error: err.message,
  //     },
  //   } as AddressActionData;
  // }

  // check if the inserted address is valid
  if (!isAddress(form.address)) {
    return {
      address: {
        error:
          "The address entered is not valid. Please ensure that it is a valid EVM address in hexadecimal format, and try again",
      },
    } as AddressActionData;
  }

  // save address in session
  jobSession.address = form.address;
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
