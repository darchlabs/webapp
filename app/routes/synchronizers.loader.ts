import { json } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { pagination, synchronizers } from "darchlabs";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";
import { withPagination } from "@middlewares/with-pagination";
import { AuthData, withAuth } from "@middlewares/with-auth";


export type SmartContractsLoaderData = {
  contracts: synchronizers.Contract[];
  pagination: pagination.Pagination;
  auth: AuthData;
};

export const SmartContractsLoader: LoaderFunction = withAuth(withPagination(async ({ context }: LoaderArgs) => {
  // get pagination context for middleware
  const p = context.pagination as pagination.Pagination | {};

  // get smart contracts
  const { contracts, pagination } = await Darchlabs.synchronizers.contracts.listContracts(p);

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json({ contracts, pagination, auth });
}));
