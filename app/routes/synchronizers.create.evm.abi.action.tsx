import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";
import { z } from "zod";
import { GetAbiEventSchema } from "@utils/get-abi-schema";

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

export const CreateSynchronizersEvmAbiAction = async function action({ request }: ActionArgs) {
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
    abi: GetAbiEventSchema(),
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
  const scSession: synchronizers.ContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

  // save abi in session
  scSession.abi = abi;
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
