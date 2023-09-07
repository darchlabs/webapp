import type { ActionFunction } from "@remix-run/node";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";
import { redirect } from "@remix-run/node";
import { type Network } from "darchlabs";
import { ValidateClient } from "@utils/validate-client";

type EditSmartContractForm = {
  redirectURL: string;
  network: Network;
  address: string;
  name: string;
  nodeURL: string;
  webhook: string;
};

export type EditSmartContractActionData = {
  error: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, network, address, name, nodeURL, webhook } = Object.fromEntries(
    formData
  ) as EditSmartContractForm;

  // check if node url is valid client for the network
  try {
    await ValidateClient(network, nodeURL);
  } catch (err: any) {
    return {
      error: err.message,
    } as EditSmartContractActionData;
  }

  // edit smart contract using form data values
  try {
    await SmartContracts.updateSmartContract(address, { name, nodeURL, webhook });
  } catch (err: any) {
    const errMsg = err?.response?.data?.error?.length > 0 ? err.response.data.error : err.error;
    return {
      error: errMsg,
    } as EditSmartContractActionData;
  }

  return redirect(redirectURL);
};
