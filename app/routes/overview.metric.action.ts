import { type ActionFunction, json } from "@remix-run/node";
import Axios from "axios";
import { type Pagination } from "darchlabs";
import { isAddress } from "ethers";

export type Metric =
  | "txs"
  | "failed-txs"
  | "success-txs"
  | "active-addresses"
  | "tvl"
  | "total-value-transferred"
  | "total-gas-spent"
  | "historical-gas-used";

export type OverviewMetricForm = {
  metric: Metric;
  address: string;
};

export type OverviewMetricActionData = {
  metric: Metric;
  address: string;
  value: number;
  updatedAt: Date;
  error?: string;
};

type Transaction = {
  id: string;
  contractId: string;
  hash: string;
  chainId: string;
  blockNumber: string;
  from: string;
  fromBalance: string;
  fromIsWhale: string;
  value: string;
  contract_balance: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  confirmations: string;
  isError: string;
  txReceiptStatus: string;
  functionName: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

export type ListTransactionsResponse = {
  data: Transaction[];
  meta: {
    pagination: Pagination;
  };
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as OverviewMetricForm;

  // prepare response
  const response = { metric: form.metric } as OverviewMetricActionData;
  const synchronizersURL = process.env.SYNCHORONIZER_API_URL;

  // check if metric form param is valid
  if (!form.metric) {
    response.error = `invalid metric=${form.metric}`;
    return json(response);
  }

  // check if address form param is valid
  if (!isAddress(form.address)) {
    response.error = `invalid address=${form.address}`;
    return json(response);
  }

  try {
    switch (form.metric) {
      case "txs": {
        const {
          data: {
            meta: { pagination },
          },
        } = await Axios.get<ListTransactionsResponse>(
          `${synchronizersURL}/api/v1/metrics/transactions/${form.address}?limit=1`
        );
        response.value = pagination.totalElements;
        break;
      }
      case "success-txs": {
        // get total txs
        const {
          data: {
            meta: {
              pagination: { totalElements: totalTxs },
            },
          },
        } = await Axios.get<ListTransactionsResponse>(
          `${synchronizersURL}/api/v1/metrics/transactions/${form.address}?limit=1`
        );

        // get failed txs
        const {
          data: {
            meta: {
              pagination: { totalElements: failedTxs },
            },
          },
        } = await Axios.get<ListTransactionsResponse>(
          `${synchronizersURL}/api/v1/metrics/transactions/${form.address}/failed?limit=1`
        );

        response.value = totalTxs - failedTxs;
        break;
      }
      case "failed-txs": {
        const {
          data: {
            meta: { pagination },
          },
        } = await Axios.get<ListTransactionsResponse>(
          `${synchronizersURL}/api/v1/metrics/transactions/${form.address}/failed?limit=1`
        );
        response.value = pagination.totalElements;
        break;
      }
      case "active-addresses": {
        const {
          data: {
            meta: { pagination },
          },
        } = await Axios.get<ListTransactionsResponse>(
          `${synchronizersURL}/api/v1/metrics/addresses/${form.address}?limit=1`
        );
        response.value = pagination.totalElements;
        break;
      }
      case "tvl": {
        const {
          data: { data: tvl },
        } = await Axios.get<{ data: number }>(`${synchronizersURL}/api/v1/metrics/tvl/${form.address}/current`);
        response.value = tvl;
        break;
      }
      case "total-value-transferred": {
        const {
          data: { data: tvl },
        } = await Axios.get<{ data: number }>(`${synchronizersURL}/api/v1/metrics/value/${form.address}/total`);
        response.value = tvl;
        break;
      }
      case "total-gas-spent": {
        const {
          data: { data: gasSpent },
        } = await Axios.get<{ data: number }>(`${synchronizersURL}/api/v1/metrics/gas/${form.address}/total`);
        response.value = gasSpent;
        break;
      }
    }
  } catch (err: any) {
    response.error = err.message;
  }

  response.updatedAt = new Date();
  return json(response);
};
