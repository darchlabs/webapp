import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";
import { z } from "zod";
import { type LoaderData } from "./nodes.create.$network.loader";
import { type NodesChainlinkNE } from "darchlabs";

type NodeEmailActionForm = {
  baseTo: string;
  nextTo: string;
  email: string;
};

export type NodeEmailActionData = {
  email: {
    error?: string;
  };
};

export const CreateNodeEmailAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NodeEmailActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    nextTo: z.string(),
    email: z.string().email(),
  });

  // validate with schema
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      email: {
        error: msgError,
      },
    } as NodeEmailActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const nodeSession: LoaderData<NodesChainlinkNE> = session.get("nodeSession");
  if (!nodeSession) {
    return redirect("/nodes/create");
  }

  // save password in session
  nodeSession.input.envVars.NODE_EMAIL = form.email;
  session.set("nodeSession", nodeSession);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = `/${form.baseTo}/create/${nodeSession.network}/nodepassword`;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
