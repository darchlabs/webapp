import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { type NodesNetworkEnvironment, type Node } from "darchlabs";
import { Nodes } from "@models/nodes/nodes.server";
import { AuthData, withAuth } from "@middlewares/with-auth";

export type LoaderData = {
  nodes: Node<NodesNetworkEnvironment>[];
  origin: string;
  auth: AuthData;
};

export const NodesLoader: LoaderFunction = withAuth(async ({ request, context }: LoaderArgs) => {
  const { data: nodes } = await Nodes.listNodes();
  const { origin } = new URL(request.url);

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json({ nodes, origin, auth });
});
