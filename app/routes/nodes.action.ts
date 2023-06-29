import type { ActionFunction } from "@remix-run/node";
import { Nodes } from "@models/nodes/nodes.server";
import { redirect } from "@remix-run/node";

type NodesActionForm = {
  action: string;
  redirectURL: string;
  id: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { action, redirectURL, id } = Object.fromEntries(formData) as NodesActionForm;

  // execute action on jobs api
  if (action === "delete") {
    await Nodes.deleteNodeById(id);
  }

  return redirect(redirectURL);
};
