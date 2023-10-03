import DarchlabsClass from "darchlabs";
import invariant from "tiny-invariant";

let Darchlabs: DarchlabsClass;

declare global {
  var __darchlabs__: DarchlabsClass;
}

if (process.env.NODE_ENV === "production") {
  Darchlabs = getClient();
} else {
  if (!global.__darchlabs__) {
    global.__darchlabs__ = getClient();
  }
  Darchlabs = global.__darchlabs__;
}

function getClient() {
  const { SYNCHORONIZER_API_URL, JOB_API_URL, NODE_API_URL, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, ETHEREUM_NODE_URL, POLYGON_NODE_URL, MUMBAI_NODE_URL } = process.env;
  invariant(typeof SYNCHORONIZER_API_URL === "string", "SYNCHORONIZER_API_URL env var not set");
  invariant(typeof JOB_API_URL === "string", "JOB_API_URL env var not set");
  invariant(typeof NODE_API_URL === "string", "NODE_API_URL env var not set");
  invariant(typeof ETHERSCAN_API_KEY === "string", "ETHERSCAN_API_KEY env var not set");
  invariant(typeof POLYGONSCAN_API_KEY === "string", "POLYGONSCAN_API_KEY env var not set");
  invariant(typeof ETHEREUM_NODE_URL === "string", "ETHEREUM_NODE_URL env var not set");
  invariant(typeof POLYGON_NODE_URL === "string", "POLYGON_NODE_URL env var not set");
  invariant(typeof MUMBAI_NODE_URL === "string", "MUMBAI_NODE_URL env var not set");

  const client = new DarchlabsClass("", {
    "synchronizers": SYNCHORONIZER_API_URL,
    "jobs": JOB_API_URL,
    "nodes": NODE_API_URL,
  });

  return client;
}

export { Darchlabs };
