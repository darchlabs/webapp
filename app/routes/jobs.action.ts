import type { ActionFunction } from "@remix-run/node";
import { job } from "@models/jobs.server";
import { redirect } from "@remix-run/node";

type DeleteSmartContractForm = {
  action: string;
  redirectURL: string;
  id: string;
};

const sleep = () => {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // get from data values
  const formData = await request.formData();
  const { action, redirectURL, id } = Object.fromEntries(formData) as DeleteSmartContractForm;

  await sleep();

  // execute action on jobs api
  if (action === "start") {
    await job.StartJob(id);
  } else if (action === "stop") {
    await job.StopJob(id);
  } else if (action === "delete") {
    await job.DeleteJob(id);
  }

  return redirect(redirectURL);
};
