import { GetNetworkNodesUrl } from "~/utils/chain-info";
import Job from "./jobs";
import invariant from "tiny-invariant";

// TODO(nb): Make this file only getting the env values from `.env.jobs`?/
// Or it should get from `.env`?

let job: Job;

declare global {
  var __jobs__: Job;
}

if (process.env.NODE_ENV === "production") {
  job = getClient();
} else {
  if (!global.__jobs__) {
    global.__jobs__ = getClient();
  }
  job = global.__jobs__;
}

function getClient() {
  const { JOB_API_URL } = process.env;
  invariant(typeof JOB_API_URL === "string", "JOB_API_URL env var not set");

  const networkNodesMap = GetNetworkNodesUrl();

  const client = new Job(JOB_API_URL, networkNodesMap);

  return client;
}

export { job };
