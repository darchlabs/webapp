import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { type SmartContractInput } from "darchlabs";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";

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
  const scSession: SmartContractInput = session.get("scSession");
  if (!scSession) {
    return redirect("/synchronizers/create");
  }

  // create synchronizer in api
  try {
    await SmartContracts.insertSmartContract(scSession);
  } catch (err: any) {
    return {
      confirm: {
        error: "Sorry, something went wrong on the server, please try again later",
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
