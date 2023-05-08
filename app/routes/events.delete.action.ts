import type { ActionFunction } from "@remix-run/node";
import { Synchronizers } from "@models/synchronizers/synchronizers.server";
import { redirect } from "@remix-run/node";

type DeleteEventForm = {
  redirectURL: string;
  address: string;
  eventName: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { redirectURL, address, eventName } = Object.fromEntries(formData) as DeleteEventForm;

  // delete event using form data values
  await Synchronizers.deleteEvent(address, eventName);

  return redirect(redirectURL);
};
