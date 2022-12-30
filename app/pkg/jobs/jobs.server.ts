import Job from "./jobs";
import invariant from "tiny-invariant";

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

  const client = new Job(JOB_API_URL);

  return client;
}

export { job };
