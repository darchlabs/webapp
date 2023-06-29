import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";
import { z } from "zod";
import { type LoaderData } from "./nodes.create.$network.loader";
import { type NodesChainlinkNE } from "darchlabs";

type NodePasswordActionForm = {
  baseTo: string;
  password: string;
};

export type NodePasswordActionData = {
  password: {
    error: string;
  };
};

export const CreateNodePasswordAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NodePasswordActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    password: z.string().min(8),
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
    } as NodePasswordActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const nodeSession: LoaderData<NodesChainlinkNE> = session.get("nodeSession");
  if (!nodeSession) {
    return redirect("/nodes/create");
  }

  // save password in session
  nodeSession.input.envVars.PASSWORD = form.password;
  nodeSession.input.envVars.NODE_EMAIL_PWD = form.password;
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
