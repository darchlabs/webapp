import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "@models/darchlabs/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";
import { GetNodeUrlByNetwork } from "@utils/get-nodeurl-by-network";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type ConfirmActionForm = {
  baseTo: string;
  nextTo: string;
};

export type ConfirmActionData = {
  confirm: {
    error?: string;
  };
};

export const CreateSynchronizersEvmConfirmAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as ConfirmActionForm;

  // get cookie session
  const session = await getSession(request.headers.get("Cookie"));
  const scSession: synchronizers.ContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

  // TODO(ca): implement this in backend 
  const nodeUrl = GetNodeUrlByNetwork(scSession.network)
  if (!nodeUrl) {
    return redirect("/synchronizers/create")
  }
  scSession.nodeURL = nodeUrl;

  // create synchronizer in api
  try {
    const client = await GetDarchlabsClient(request);
    await client.synchronizers.contracts.createContract(scSession);
  } catch (err: any) {
    return {
      confirm: {
        error: `Sorry, something went wrong on the server, please try again later (${err.message})`,
      },
    };
  }

  // redirect and destroy session
  return redirect(`/${form.baseTo}`, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
