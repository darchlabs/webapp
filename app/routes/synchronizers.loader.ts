import { json } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { pagination, synchronizers } from "darchlabs";
import { withPagination } from "@middlewares/with-pagination";
import { AuthData, withAuth } from "@middlewares/with-auth";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

export type ContractsLoaderData = {
  contracts: synchronizers.Contract[];
  pagination: pagination.Pagination;
  auth: AuthData;
};

export const ContractsLoader: LoaderFunction = withAuth(withPagination(async ({ context, request }: LoaderArgs) => {
  // get pagination context for middleware
  const p = context.pagination as pagination.Pagination || {};

  // get contracts from darchlabs
  let contracts: synchronizers.Contract[];
  let pagination: pagination.Pagination;
  try {
    const client = await GetDarchlabsClient(request);
    ({ contracts, pagination } = await client.synchronizers.contracts.listContracts(p))
  } catch (err) {
    throw err
  }

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json({ contracts, pagination, auth });
}));
