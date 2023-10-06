import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/darchlabs/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";
import { z } from "zod";

type NameActionForm = {
  baseTo: string;
  nextTo: string;
  name: string;
};

export type NameActionData = {
  name: {
    error: string;
  };
};

export const CreateSynchronizersEvmNameAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NameActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    name: z.string().min(1),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "The name entered is not valid. Please try again";

    return {
      name: {
        error: msgError,
      },
    } as NameActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const scSession: synchronizers.ContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

  // save name in session
  scSession.name = form.name;
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
