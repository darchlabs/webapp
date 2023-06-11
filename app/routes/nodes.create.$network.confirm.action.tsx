import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "@models/nodes/create-node-cookie.server";
import { Nodes } from "@models/nodes/nodes.server";
import { type LoaderData } from "./nodes.create.$network.loader";
import { type NodesNetworkEnvironment } from "darchlabs";

type ConfirmActionForm = {
  baseTo: string;
};

export type ConfirmActionData = {
  confirm: {
    error?: string;
  };
};

export const CreateNodeConfirmAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as ConfirmActionForm;

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const nodeSession: LoaderData<NodesNetworkEnvironment> = session.get("nodeSession");
  if (!nodeSession) {
    return redirect("/nodes/create");
  }

  // create node in api
  try {
    await Nodes.insertNode(nodeSession.input);
  } catch (err: any) {
    return {
      confirm: {
        error: "Sorry, something went wrong on the server, please try again later",
      },
    } as ConfirmActionData;
  }

  // redirect and destroy session
  return redirect(`/${form.baseTo}`, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
