import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-synchronizers-cookie.server";
import { network, synchronizers } from "darchlabs";
import { z } from "zod";

type NetworkActionForm = {
  baseTo: string;
  nextTo: string;
  network: network.Network;
};

export type NetworkActionData = {
  network?: {
    error?: string;
  };
};

export const CreateSynchronizersNetworkAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NetworkActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    network: z.string().refine((n) => {
      return network.Networks.includes(n as network.Network);
    }),
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
    } as NetworkActionData;
  }

  // get network info
  const info = network.NetworkInfo[form.network as network.Network];
  
  // upsert to create synchronizer cookie
  const session = await getSession(request.headers.get("Cookie"));
  const scInput: synchronizers.ContractInput = session.get("scSession");

  // set nework value in cookie
  scInput.network = form.network;
  session.set("scSession", scInput);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = form.nextTo ? `/${form.baseTo}/create/${info.type}/${form.nextTo}` : form.baseTo;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
