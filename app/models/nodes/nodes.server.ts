import { Nodes as NodesClass } from "darchlabs";
import invariant from "tiny-invariant";

let Nodes: NodesClass;

declare global {
  var __nodes__: NodesClass;
}

if (process.env.NODE_ENV === "production") {
  Nodes = getClient();
} else {
  if (!global.__nodes__) {
    global.__nodes__ = getClient();
  }
  Nodes = global.__nodes__;
}

function getClient() {
  const { NODE_API_URL } = process.env;
  invariant(typeof NODE_API_URL === "string", "NODE_API_URL env var not set");

  const client = new NodesClass(NODE_API_URL);

  return client;
}

export { Nodes };
