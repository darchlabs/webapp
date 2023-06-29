import { json, type LoaderFunction, type LoaderArgs } from "@remix-run/node";
import { type NodesNetworkEnvironment, type NodeInput, type NetworkEnvironmentKey } from "darchlabs";
import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";

// export type LoaderData<T> = {
//   node: T;
// };

export type LoaderData = {
  network: NetworkEnvironmentKey;
  input: NodeInput<NodesNetworkEnvironment>;
};

//. hacer validación si entro a una ruta que no corresponde segun internalNetworl

export const CreateNodeLoader: LoaderFunction = withCookie<LoaderData>(
  "nodeSession",
  getSession,
  commitSession,
  async ({ context }: LoaderArgs) => {
    // get node session
    const nodeSession = context["nodeSession"] as Cookie<LoaderData>;
    const { network, input } = nodeSession.data;

    return json(
      { network, input },
      {
        headers: {
          "Set-Cookie": nodeSession.cookie,
        },
      }
    );
  }
);
