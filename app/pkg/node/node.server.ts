import Node from "./node";
import invariant from "tiny-invariant";

let node: Node;

declare global {
  var __node__: Node;
}

if (process.env.NODE_ENV === "production") {
  node = getClient();
} else {
  if (!global.__node__) {
    global.__node__ = getClient();
  }
  node = global.__node__;
}

function getClient() {
  const { NODE_API_URL } = process.env;
  invariant(typeof NODE_API_URL === "string", "NODE_API_URL env var not set");

  const client = new Node(NODE_API_URL);

  return client;
}

export { node };

