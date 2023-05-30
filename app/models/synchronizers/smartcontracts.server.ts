import { SmartContracts as SmartContractsClass } from "darchlabs";
import invariant from "tiny-invariant";

let SmartContracts: SmartContractsClass;

declare global {
  var __smartcontracts__: SmartContractsClass;
}

if (process.env.NODE_ENV === "production") {
  SmartContracts = getClient();
} else {
  if (!global.__smartcontracts__) {
    global.__smartcontracts__ = getClient();
  }
  SmartContracts = global.__smartcontracts__;
}

function getClient() {
  const { SYNCHORONIZER_API_URL, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY } = process.env;
  invariant(typeof SYNCHORONIZER_API_URL === "string", "SYNCHORONIZER_API_URL env var not set");
  invariant(typeof ETHERSCAN_API_KEY === "string", "ETHERSCAN_API_KEY env var not set");
  invariant(typeof POLYGONSCAN_API_KEY === "string", "POLYGONSCAN_API_KEY env var not set");

  const client = new SmartContractsClass(SYNCHORONIZER_API_URL);

  return client;
}

export { SmartContracts };
