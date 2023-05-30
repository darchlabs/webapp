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
  const { SYNCHORONIZER_API_URL } = process.env;
  invariant(typeof SYNCHORONIZER_API_URL === "string", "SYNCHORONIZER_API_URL env var not set");

  const client = new SmartContractsClass(SYNCHORONIZER_API_URL);

  return client;
}

export { SmartContracts };
