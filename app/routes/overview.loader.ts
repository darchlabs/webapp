import { withPagination } from "@middlewares/with-pagination";
import { type LoaderFunction, json, type LoaderArgs } from "@remix-run/node";
import { type Pagination, type SmartContract } from "darchlabs";
import { SmartContracts } from "@models/synchronizers/smartcontracts.server";
import { AuthData, withAuth } from "@middlewares/with-auth";

export type LoaderData = {
  smartcontracts: SmartContract[];
  auth: AuthData;
};

export const OverviewLoader: LoaderFunction = withAuth(withPagination(async ({ context }: LoaderArgs) => {
  // get pagination context from middleware
  const pagination = context.pagination as Pagination | {};

  // get auth context from middleware
  const auth = context.auth as AuthData;

  // get smart contracts
  const { data, } = await SmartContracts.listSmartContracts(pagination);

  return json<LoaderData>({ smartcontracts: data, auth });
}));