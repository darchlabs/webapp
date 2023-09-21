import { json } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import type { ListSmartContractsResponse, Pagination } from "darchlabs";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";
import { withPagination } from "@middlewares/with-pagination";
import { AuthData, withAuth } from "@middlewares/with-auth";

export type SmartContractsLoaderData = {
  smartcontracts: ListSmartContractsResponse;
  auth: AuthData;
};

export const SmartContractsLoader: LoaderFunction = withAuth(withPagination(async ({ context }: LoaderArgs) => {
  // get pagination context for middleware
  const pagination = context.pagination as Pagination | {};

  // get smart contracts
  const smartcontracts = await SmartContracts.listSmartContracts(pagination);

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json({ smartcontracts, auth });
}));
