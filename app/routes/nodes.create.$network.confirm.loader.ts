import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { type LoaderArgs, type LoaderFunction, json, redirect } from "@remix-run/node";
import {
  type NetworkEnvironmentKey,
  NetworksEnvironments,
  type NodesCeloNE,
  type NodesNetworkEnvironment,
} from "darchlabs";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";
import { type LoaderData } from "./nodes.create.$network.loader";

export const CreateNodeConfirmLoader: LoaderFunction = withCookie<LoaderData<NodesNetworkEnvironment>>(
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

    // define options to use in json or in redirect
    const opts = {
      headers: {
        "Set-Cookie": nodeSession.cookie,
      },
    };

    // check if any attribute are empty in job session
    if (!network || !input?.network || !input?.envVars?.ENVIRONMENT) {
      // redirect to network step
      return redirect("/nodes/create", opts);
    } else if (!input?.envVars?.PASSWORD) {
      // redirect to password step
      return redirect(`/nodes/create/${networkParam}/password`, opts);
    }

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
