import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";
import { z } from "zod";

type WebhookActionForm = {
  baseTo: string;
  nextTo: string;
  webhook: string;
};

export type WebhookActionData = {
  webhook: {
    error: string;
  };
};

export const CreateSynchronizersEvmWebhookAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as WebhookActionForm;

  const urlRegex = /^(https?:\/\/)?(([\w.-]+\.[a-zA-Z]{2,})|localhost:\d+)(\/.*)?$/;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string().min(1),
    nextTo: z.string().min(1),
    webhook: z
      .string()
      .refine((value) => urlRegex.test(value), { message: "The webhook entered is not valid. Please try again" }),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "The webhook entered is not valid. Please try again";

    return {
      webhook: {
        error: msgError,
      },
    } as WebhookActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const scSession: synchronizers.ContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

  // save webhook in session
  scSession.webhook = form.webhook;
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
