import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";
import { z } from "zod";
import { type LoaderData } from "./nodes.create.$network.loader";
import { type NodesCeloNE } from "darchlabs";

type PasswordActionForm = {
  baseTo: string;
  password: string;
};

export type PasswordActionData = {
  password: {
    error: string;
  };
};

export const CreateNodePasswordAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as PasswordActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    password: z.string().min(12),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      password: {
        error: msgError,
      },
    } as PasswordActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const nodeSession: LoaderData<NodesCeloNE> = session.get("nodeSession");
  if (!nodeSession) {
    return redirect("/nodes/create");
  }

  // save password in session
  nodeSession.input.envVars.PASSWORD = form.password;
  session.set("nodeSession", nodeSession);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = `/${form.baseTo}/create/${nodeSession.network}/confirm`;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
