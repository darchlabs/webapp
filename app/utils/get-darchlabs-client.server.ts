import { redirect } from "@remix-run/node";
import { GetToken } from "./token.server";
import Darchlabs from "darchlabs";
import invariant from "tiny-invariant";

export const GetDarchlabsClient = async (request: Request): Promise<Darchlabs> => {
  const token = await GetToken(request);

  // redirect to /login use remix redirect if token is empty
  if (token === "") {
    throw redirect("/login")
  }

  // get url from env vars
  const { SYNCHORONIZER_API_URL, JOB_API_URL, NODE_API_URL, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, ETHEREUM_NODE_URL, POLYGON_NODE_URL, MUMBAI_NODE_URL } = process.env;
  invariant(typeof SYNCHORONIZER_API_URL === "string", "SYNCHORONIZER_API_URL env var not set");
  invariant(typeof JOB_API_URL === "string", "JOB_API_URL env var not set");
  invariant(typeof NODE_API_URL === "string", "NODE_API_URL env var not set");
  invariant(typeof ETHERSCAN_API_KEY === "string", "ETHERSCAN_API_KEY env var not set");
  invariant(typeof POLYGONSCAN_API_KEY === "string", "POLYGONSCAN_API_KEY env var not set");
  invariant(typeof ETHEREUM_NODE_URL === "string", "ETHEREUM_NODE_URL env var not set");
  invariant(typeof POLYGON_NODE_URL === "string", "POLYGON_NODE_URL env var not set");
  invariant(typeof MUMBAI_NODE_URL === "string", "MUMBAI_NODE_URL env var not set");

  // create darchlabs client
  const client = new Darchlabs(token, {
    "synchronizers": SYNCHORONIZER_API_URL,
    "jobs": JOB_API_URL,
    "nodes": NODE_API_URL,
  });

  return client;
}