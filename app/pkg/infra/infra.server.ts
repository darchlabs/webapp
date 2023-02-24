import { GetNetworkNodesUrl } from "~/utils/chain-info";
import Job from "./infra";
import invariant from "tiny-invariant";
import Infra from "./infra";

// TODO(nb): Make this file only getting the env values from `.env.jobs`?/
// Or it should get from `.env`?

let infra: Infra;

declare global {
  var __infra__: Infra;
}

if (process.env.NODE_ENV === "production") {
  infra = getClient();
} else {
  if (!global.__infra__) {
    global.__infra__ = getClient();
  }
  infra = global.__infra__;
}

function getClient() {
  const { INFRA_API_URL } = process.env;
  invariant(typeof INFRA_API_URL === "string", "INFRA_API_URL env var not set");

  const client = new Job(INFRA_API_URL);

  return client;
}

export { infra };
