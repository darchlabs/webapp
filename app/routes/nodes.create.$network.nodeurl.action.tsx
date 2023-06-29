import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";
import { z } from "zod";
import { type LoaderData } from "./nodes.create.$network.loader";
import { type NodesChainlinkNE } from "darchlabs";
import { ValidateClient } from "@utils/validate-client";

type NodeUrlActionForm = {
  baseTo: string;
  nextTo: string;
  nodeUrl: string;
};

export type NodeUrlActionData = {
  nodeUrl: {
    error?: string;
  };
};

export const CreateNodeUrlAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NodeUrlActionForm;

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
    } as NodeUrlActionData;
  }

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const nodeSession: LoaderData<NodesChainlinkNE> = session.get("nodeSession");
  if (!nodeSession) {
    return redirect("/nodes/create");
  }

  // check if nose url is valid client for the network
  try {
    await ValidateClient(nodeSession.network, form.nodeUrl, false);
  } catch (err: any) {
    return {
      nodeUrl: {
        error: err.message,
      },
    } as NodeUrlActionData;
  }

  // save password in session
  nodeSession.input.envVars.ETH_URL = form.nodeUrl;
  session.set("nodeSession", nodeSession);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = `/${form.baseTo}/create/${nodeSession.network}/nodeusername`;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
