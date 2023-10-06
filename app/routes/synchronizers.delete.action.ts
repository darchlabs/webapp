import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type DeleteContractForm = {
  redirectURL: string;
  address: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address } = Object.fromEntries(formData) as DeleteContractForm;

  // delete contract from synchronizers service
  try {
    const client = await GetDarchlabsClient(request);
    await client.synchronizers.contracts.deleteContractByAddress(address);
  } catch (err: any) {
    throw err;
  }

  return redirect(redirectURL);
};
