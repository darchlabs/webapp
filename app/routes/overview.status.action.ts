import type { ActionFunction } from "@remix-run/node";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";
import { job } from "@models/jobs.server";

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

  // get data from synchronizers service
  try {
    const { data } = await SmartContracts.listSmartContracts({});
    response.synchronizers.failed = data.reduce(
      (sumSc, sc) => (sc.events.every((ev) => ev.status === "error") ? sumSc + 1 : sumSc),
      0
    );
    response.synchronizers.working = data.length - response.synchronizers.failed;
  } catch (err: any) {
    response.synchronizers.error = err.mesage;
  }

  // get data from jobs service
  try {
    const { data, meta } = await job.ListJobs();
    if (meta === 200) {
      response.jobs.failed = data.reduce(
        (sum, j) => (j.status === "error" || j.status === "autoStopped" ? sum + 1 : sum),
        0
      );
      response.jobs.working = data.length - response.jobs.failed;
    }
  } catch (err: any) {
    response.jobs.error = err.mesage;
  }

  // TODO(ca): get data from nodes service

  response.updatedAt = new Date();
  return response;
};
