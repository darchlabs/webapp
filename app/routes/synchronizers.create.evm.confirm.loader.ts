import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { type LoaderArgs, type LoaderFunction, json, redirect } from "@remix-run/node";
import { network, synchronizers } from "darchlabs";
import { getSession, commitSession } from "@models/synchronizers/create-synchronizers-cookie.server";

export const CreateSynchronizersEvmConfirmLoader: LoaderFunction = withCookie<synchronizers.ContractInput>(
  "scSession",
  getSession,
  commitSession,
  async ({ context }: LoaderArgs) => {
    // get smartcontract session
    const scSession = context["scSession"] as Cookie<synchronizers.ContractInput>;

    // define options to use in json or in redirect
    const opts = {
      headers: {
        "Set-Cookie": scSession.cookie,
      },
    };

    // check if any attribute are empty in smartcontract session
    if (!scSession.data.network || scSession.data.network === ("" as network.Network)) {
      // redirect to network step
      return redirect("/synchronizers/create", opts);
    } else if (!scSession.data.name || scSession.data.name === "") {
      // redirect to name step
      return redirect("/synchronizers/create/evm/name", opts);
    } else if (!scSession.data.nodeURL || scSession.data.nodeURL === "") {
      // redidect to node url step
      return redirect("/synchronizers/create/evm/node", opts);
    } else if (!scSession.data.address || scSession.data.address == "") {
      // redirect to address step
      return redirect("/synchronizers/create/evm/address", opts);
    } else if (!scSession.data.abi || !Array.isArray(scSession.data.abi) || !scSession.data.abi.length) {
      // redirect to abi step
      return redirect("/synchronizers/create/evm/abi", opts);
    }

    return json(
      {
        smartcontract: scSession.data,
      },
      {
        headers: {
          "Set-Cookie": scSession.cookie,
        },
      }
    );
  }
);
