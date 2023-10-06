import { withPagination } from "@middlewares/with-pagination";
import { type LoaderFunction, json, type LoaderArgs, redirect } from "@remix-run/node";
import { pagination, synchronizers } from "darchlabs"
import { AuthData, withAuth } from "@middlewares/with-auth";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

export type LoaderData = {
  contracts: synchronizers.Contract[];
  auth: AuthData;
};

export const OverviewLoader: LoaderFunction = withAuth(withPagination(async ({ context, request }: LoaderArgs) => {
  // get pagination context from middleware
  const pagination = context.pagination as pagination.Pagination || {};

  // get auth context from middleware
  const auth = context.auth as AuthData;

  // get smart contracts
  let contracts: synchronizers.Contract[];
  try {
    const client = await GetDarchlabsClient(request);
    ({ contracts } = await client.synchronizers.contracts.listContracts(pagination));
  } catch (err) {
    throw err;
  }

  return json<LoaderData>({ contracts, auth });
}));