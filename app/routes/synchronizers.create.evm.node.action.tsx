import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { type SmartContractInput } from "darchlabs";
import { z } from "zod";
import { ValidateClient } from "@utils/validate-client";

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

export const CreateSynchronizersEvmNodeAction = async function action({ request }: ActionArgs) {
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
  const scSession: SmartContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

  // check if nose url is valid client for the network
  // try {
  //   await ValidateClient(scSession.network, form.nodeUrl);
  // } catch (err: any) {
  //   return {
  //     nodeUrl: {
  //       error: err.message,
  //     },
  //   } as NodeActionData;
  // }

  // save node url in session
  scSession.nodeURL = form.nodeUrl;
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
