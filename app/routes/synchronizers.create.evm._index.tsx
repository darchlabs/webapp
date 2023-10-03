import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";

export type Step = "Network" | "Node" | "Address" | "ABI" | "Confirm";
export const Steps: Step[] = ["Network", "Node", "Address", "ABI", "Confirm"];

export type LoaderData = {
  contract: synchronizers.ContractInput;
};

export const loader: LoaderFunction = async () => {
  return redirect("/synchronizers/create/evm/node");
};

export const CreateSynchronizersEvmLoader: LoaderFunction = withCookie<synchronizers.ContractInput>(
  "scSession",
  getSession,
  commitSession,
  async ({ context }: LoaderArgs) => {
    // get contract session
    const scSession = context["scSession"] as Cookie<synchronizers.ContractInput>;

    return json(
      {
        contract: scSession.data,
      },
      {
        headers: {
          "Set-Cookie": scSession.cookie,
        },
      }
    );
  }
);
