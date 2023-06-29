import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/nodes/create-node-cookie.server";
// import { type NodesNetwork, NodesNetworks, type NodeInput } from "darchlabs";
import { z } from "zod";
import {
  type NetworkEnvironmentKey,
  NetworksEnvironments,
  type NodeInput,
  type NodesNetworkEnvironment,
  type NodesCeloNE,
  NodesChainlinkNE,
} from "darchlabs";
import { type LoaderData } from "./nodes.create.loader";

type NetworkActionForm = {
  baseTo: string;
  network: NetworkEnvironmentKey;
};

export type NetworkActionData = {
  network?: {
    error?: string;
  };
};

export const CreateNodeNetworkAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as NetworkActionForm;

  // define schema
  const subscriberSchema = z.object({
    baseTo: z.string(),
    network: z.string().refine((network) => {
      return Object.keys(NetworksEnvironments).includes(network as NetworkEnvironmentKey);
    }),
  });

  // validate with schem
  const result = subscriberSchema.safeParse(form);
  if (!result.success) {
    const [error] = result.error.errors;
    const msgError = error ? error.message : "invalid error";

    return {
      network: {
        error: msgError,
      },
    } as NetworkActionData;
  }

  // upsert to create nodes cookie
  const session = await getSession(request.headers.get("Cookie"));
  const data: LoaderData = session.get("nodeSession");

  // // set nework value in cookie
  data.network = form.network;
  if (!data.input) {
    data.input = {} as NodeInput<NodesNetworkEnvironment>;
  }

  const [network, environment] = NetworksEnvironments[data.network];

  let nextTo: string;
  switch (data.network) {
    case "alfajores":
      nextTo = "password";
      const celoNE = [network, environment] as NodesCeloNE;
      data.input = {
        network: "celo",
        envVars: {
          ENVIRONMENT: environment,
        },
      } as NodeInput<typeof celoNE>;
      break;
    case "chainlink_sepolia":
      nextTo = "nodeurl";
      const chainlinkNE = [network, environment] as NodesChainlinkNE;
      data.input = {
        network: "chainlink",
        envVars: {
          ENVIRONMENT: environment,
        },
      } as NodeInput<typeof chainlinkNE>;
      break;
    default:
      return {
        network: {
          error: `Invalid selected network: ${data.network}`,
        },
      } as NetworkActionData;
  }

  session.set("nodeSession", data);
  const cookie = await commitSession(session);

  // redirect
  const redirectTo = `/${form.baseTo}/create/${data.network}/${nextTo}`;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
