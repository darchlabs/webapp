import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";
import { z } from "zod";
import { isAddress } from "ethers";

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

export const CreateSynchronizersEvmAddressAction = async function action({ request }: ActionArgs) {
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
  const scSession: synchronizers.ContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

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
  scSession.address = form.address;
  session.set("scSession", scSession);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = form.nextTo ? `/${form.baseTo}/create/evm/${form.nextTo}` : form.baseTo;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
