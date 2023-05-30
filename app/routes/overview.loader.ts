import { withPagination } from "@middlewares/with-pagination";
import { type LoaderFunction, json, type LoaderArgs } from "@remix-run/node";
import { type Pagination, type SmartContract } from "darchlabs";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";

export type LoaderData = {
  smartcontracts: SmartContract[];
};

export const OverviewLoader: LoaderFunction = withPagination(async ({ context }: LoaderArgs) => {
  // get pagination context for middleware
  const pagination = context.pagination as Pagination | {};

  // get smart contracts
  const { data } = await SmartContracts.listSmartContracts(pagination);

  return json<LoaderData>({ smartcontracts: data });
});
