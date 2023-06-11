import { json, type LoaderFunction, type LoaderArgs, redirect } from "@remix-run/node";
import {
  type NodesNetworkEnvironment,
  type NodeInput,
  type NetworkEnvironmentKey,
  type NodesCeloNE,
  NetworksEnvironments,
} from "darchlabs";
import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";

export type LoaderData<NE extends NodesNetworkEnvironment> = {
  network: NetworkEnvironmentKey;
  input: NodeInput<NE>;
};

//. hacer validación si entro a una ruta que no corresponde segun internalNetworl

export const CreateNodeLoader: LoaderFunction = withCookie<LoaderData<NodesNetworkEnvironment>>(
  "nodeSession",
  getSession,
  commitSession,
  async ({ context, params }: LoaderArgs) => {
    // get $network path param
    const { network: networkParam } = params as { network: NetworkEnvironmentKey };
    if (!networkParam) {
      return redirect("/nodes");
    }

    // get [network, enviroment] tuple
    const [n, e] = NetworksEnvironments[networkParam];
    const celoNE = [n, e] as NodesCeloNE;

    // get node session
    const nodeSession = context["nodeSession"] as Cookie<LoaderData<typeof celoNE>>;
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
