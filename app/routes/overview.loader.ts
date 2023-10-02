import { withPagination } from "@middlewares/with-pagination";
import { type LoaderFunction, json, type LoaderArgs } from "@remix-run/node";
import { pagination, synchronizers } from "darchlabs";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";
import { AuthData, withAuth } from "@middlewares/with-auth";

export type LoaderData = {
  contracts: synchronizers.Contract[];
  auth: AuthData;
};

export const OverviewLoader: LoaderFunction = withAuth(withPagination(async ({ context }: LoaderArgs) => {
  // get pagination context from middleware
  const pagination = context.pagination as pagination.Pagination | {};

  // get auth context from middleware
  const auth = context.auth as AuthData;

  // get smart contracts
  const { contracts, } = await Darchlabs.synchronizers.contracts.listContracts(pagination);

  return json<LoaderData>({ contracts, auth });
}));