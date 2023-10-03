import { json, redirect, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { synchronizers} from "darchlabs";
import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { getSession, commitSession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { GetABI } from "@utils/get-abi";

export type ContractsLoaderData = {
  contracts: synchronizers.Contract[];
};

export const CreateSynchronizersEvmAbiLoader: LoaderFunction = withCookie<synchronizers.ContractInput>(
  "scSession",
  getSession,
  commitSession,
  async ({ context, request }: LoaderArgs) => {
    // get contract session
    let scSession = context["scSession"] as Cookie<synchronizers.ContractInput>;
    const { network, address } = scSession.data;

    // get and save abi from scan
    try {
      const abi = await GetABI(network, address);
      const session = await getSession(request.headers.get("Cookie"));
      const scSession: synchronizers.ContractInput = session.get("scSession");
      session.set("scSession", { ...scSession, abi });
      await commitSession(session);
      return redirect("/synchronizers/create/evm/confirm");
    } catch (err: any) {
      console.log(`Warn: ${err.message}`);
    }

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
