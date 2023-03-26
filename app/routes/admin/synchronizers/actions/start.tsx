import type { ActionFunction } from "@remix-run/node";
import { synchronizer } from "../../../../pkg/synchronizer/synchronizer.server";
import { redirect } from "@remix-run/node";

type StartEventForm = {
  redirectURL: string;
  address: string;
  eventName: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address, eventName } = Object.fromEntries(formData) as StartEventForm;

  // start event using form data values
  await synchronizer.StartEvent(address, eventName);

  return redirect(redirectURL);
};
