import type { ActionFunction } from "@remix-run/node";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";
import { redirect } from "@remix-run/node";

type DeleteSmartContractForm = {
  redirectURL: string;
  address: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address } = Object.fromEntries(formData) as DeleteSmartContractForm;

  // delete smart contract using form data values
  await SmartContracts.deleteSmartContractByAddress(address);

  return redirect(redirectURL);
};
