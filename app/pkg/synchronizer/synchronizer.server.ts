import Synchronizer from "./synchronizer";
import invariant from "tiny-invariant";

let synchronizer: Synchronizer;

declare global {
  var __synchronizer__: Synchronizer;
}

if (process.env.NODE_ENV === "production") {
  synchronizer = getClient();
} else {
  if (!global.__synchronizer__) {
    global.__synchronizer__ = getClient();
  }
  synchronizer = global.__synchronizer__;
}

function getClient() {
  const { SYNCHORONIZER_API_URL } = process.env;
  invariant(typeof SYNCHORONIZER_API_URL === "string", "SYNCHORONIZER_API_URL env var not set");

  const client = new Synchronizer(SYNCHORONIZER_API_URL);

  return client;
}

export { synchronizer };
