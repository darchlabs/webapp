import type { ActionFunction } from "@remix-run/node";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";
import { redirect } from "@remix-run/node";

type RestartSmartContractForm = {
  redirectURL: string;
  address: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address } = Object.fromEntries(formData) as RestartSmartContractForm;

  // restart smart contract using form data values
  await Darchlabs.synchronizers.contracts.restartContractByAddress(address);

  return redirect(redirectURL);
};
