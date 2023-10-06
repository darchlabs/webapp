import type { ActionFunction } from "@remix-run/node";
import { Nodes } from "@models/nodes/nodes.server";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

export type Service = "synchronizers" | "jobs" | "nodes";

export type Status = {
  error?: string;
  working: number;
  failed: number;
};

export type OverviewStatusActionData = {
  synchronizers: Status;
  jobs: Status;
  nodes: Status;
  updatedAt: Date;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // prepare response
  const response = {
    synchronizers: { working: 0, failed: 0 },
    jobs: { working: 0, failed: 0 },
    nodes: { working: 0, failed: 0 },
  } as OverviewStatusActionData;

  const client = await GetDarchlabsClient(request);

  // get data from synchronizers service
  try {
    const { contracts } = await client.synchronizers.contracts.listContracts({});

    response.synchronizers.failed = contracts.reduce((sumSc, sc) => {
      const some = sc.events.some((ev) => ev.status === "error");
      if (some) {
        return sumSc + 1;
      }

      if (sc.status === "error" || sc.status === "quota_exceeded") {
        return sumSc + 1;
      }

      return sumSc;
    }, 0);

    response.synchronizers.working = contracts.length - response.synchronizers.failed;
  } catch (err: any) {
    response.synchronizers.error = err.mesage;
  }

  // get data from jobs service
  try {
    const jobs = await client.jobs.listJobs();
    response.jobs.failed = jobs.reduce(
      (sum, j) => (j.status === "error" || j.status === "autoStopped" ? sum + 1 : sum),
      0
    );
    response.jobs.working = jobs.length - response.jobs.failed;
  } catch (err: any) {
    response.jobs.error = err.mesage;
  }

  try {
    const { data } = await Nodes.listNodes();
    response.nodes.failed = data.reduce((sum, j) => (j.status === "error" ? sum + 1 : sum), 0);
    response.nodes.working = data.length - response.nodes.failed;
  } catch (err: any) {
    response.nodes.error = err.mesage;
  }

  response.updatedAt = new Date();
  return response;
};
