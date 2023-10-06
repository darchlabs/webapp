import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { network } from "darchlabs";
import { ValidateClient } from "@utils/validate-client";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type EditContractForm = {
  redirectURL: string;
  network: network.Network;
  address: string;
  name: string;
  nodeURL: string;
  webhook: string;
};

export type EditContractActionData = {
  error: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, network, address, name, nodeURL, webhook } = Object.fromEntries(
    formData
  ) as EditContractForm;

  // check if node url is valid client for the network
  try {
    await ValidateClient(network, nodeURL);
  } catch (err: any) {
    return {
      error: err.message,
    } as EditContractActionData;
  }

  // edit smart contract using form data values
  try {
    const client = await GetDarchlabsClient(request);
    await client.synchronizers.contracts.updateContract(address, { name, nodeURL, webhook });
  } catch (err: any) {
    const errMsg = err?.response?.data?.error?.length > 0 ? err.response.data.error : err.error;
    return {
      error: errMsg,
    } as EditContractActionData;
  }

  return redirect(redirectURL);
};
