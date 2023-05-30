import { json } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import type { ListSmartContractsResponse, Pagination } from "darchlabs";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";
import { withPagination } from "@middlewares/with-pagination";

export type SmartContractsLoaderData = {
  smartcontracts: ListSmartContractsResponse;
};

export const SmartContractsLoader: LoaderFunction = withPagination(async ({ context }: LoaderArgs) => {
  // get pagination context for middleware
  const pagination = context.pagination as Pagination | {};

  // get smart contracts
  const smartcontracts = await SmartContracts.listSmartContracts(pagination);

  return json<SmartContractsLoaderData>({ smartcontracts });
});
