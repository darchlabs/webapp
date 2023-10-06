import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type RestartContractForm = {
  redirectURL: string;
  address: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address } = Object.fromEntries(formData) as RestartContractForm;

  // restart contract using form data values
  try {
    const client = await GetDarchlabsClient(request);
    await client.synchronizers.contracts.restartContractByAddress(address);
  } catch (err: any) {
    throw err;
  }

  return redirect(redirectURL);
};
