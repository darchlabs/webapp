import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "@models/synchronizers/create-synchronizers-cookie.server";
import { synchronizers } from "darchlabs";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";
import { AxiosError, isAxiosError } from "axios";

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

  // create synchronizer in api
  try {
    await Darchlabs.synchronizers.contracts.createContract(scSession);
  } catch (err: AxiosError | unknown) {
    let error = "Sorry, something went wrong on the server, please try again later";
    if (isAxiosError(err)) {
      error = (err?.response?.data?.error) ? `${error} (${err?.response?.data?.error})` : error
    }

    return {
      confirm: {
        error,
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
