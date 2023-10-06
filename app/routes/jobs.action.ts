import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type JobActionForm = {
  action: string;
  redirectURL: string;
  id: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { action, redirectURL, id } = Object.fromEntries(formData) as JobActionForm;

  try {
    // get darchlabs client
    const client = await GetDarchlabsClient(request);

    // execute action on jobs api
    if (action === "start") {
      await client.jobs.startJob(id);
    } else if (action === "stop") {
      await client.jobs.stopJob(id);
    } else if (action === "delete") {
      await client.jobs.deleteJob(id);
    }
  } catch (err) {
    throw err
  }

  return redirect(redirectURL);
};
