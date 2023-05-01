import { Synchronizers as SynchronizersClass } from "darchlabs";
import invariant from "tiny-invariant";

let Synchronizers: SynchronizersClass;

declare global {
  var __synchronizers__: SynchronizersClass;
}

if (process.env.NODE_ENV === "production") {
  Synchronizers = getClient();
} else {
  if (!global.__synchronizers__) {
    global.__synchronizers__ = getClient();
  }
  Synchronizers = global.__synchronizers__;
}

function getClient() {
  const { SYNCHORONIZER_API_URL } = process.env;
  invariant(typeof SYNCHORONIZER_API_URL === "string", "SYNCHORONIZER_API_URL env var not set");

  const client = new SynchronizersClass(SYNCHORONIZER_API_URL);

  return client;
}

export { Synchronizers };
