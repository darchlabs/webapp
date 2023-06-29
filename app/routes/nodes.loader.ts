import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { type NodesNetworkEnvironment, type Node } from "darchlabs";
import { Nodes } from "@models/nodes/nodes.server";

export type LoaderData = {
  nodes: Node<NodesNetworkEnvironment>[];
  origin: string;
};

export const NodesLoader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const { data: nodes } = await Nodes.listNodes();
  const { origin } = new URL(request.url);

  return json({ nodes, origin });
};
