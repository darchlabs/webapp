import type { ActionFunction } from "@remix-run/node";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";
import { redirect } from "@remix-run/node";

type RestartContractForm = {
  redirectURL: string;
  address: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address } = Object.fromEntries(formData) as RestartContractForm;

  // restart contract using form data values
  await Darchlabs.synchronizers.contracts.restartContractByAddress(address);

  return redirect(redirectURL);
};
