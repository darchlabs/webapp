import { type ActionFunction, json } from "@remix-run/node";
import Axios from "axios";
import { isAddress } from "ethers";

export type HistoricalMetric = "historical-gas-used";

export type OverviewHistoricalMetricForm = {
  startTime: string;
  endTime: string;
  interval: string;
  metric: HistoricalMetric;
  address: string;
};

type Value = [point: string, timestamp: string];

export type OverviewHistoricalMetricActionData = {
  metric: HistoricalMetric;
  address: string;
  points: number[];
  labels: string[];
  updatedAt: Date;
  error?: string;
};

export type ListHistoricalResponse = {
  data: Value[];
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as OverviewHistoricalMetricForm;

  // prepare response
  const response = { metric: form.metric, points: [], labels: [] } as unknown as OverviewHistoricalMetricActionData;
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
      case "historical-gas-used": {
        const {
          data: { data: values },
        } = await Axios.get<ListHistoricalResponse>(
          `${synchronizersURL}/api/v1/metrics/gas/${form.address}?startTime=${form.startTime}&endTime=${form.endTime}&interval=${form.interval}`
        );

        for (let i = 0; i < values.length; i++) {
          const [value, timestamp] = values[i];
          response.points.push(Number(value));
          response.labels.push(timestamp);
        }

        break;
      }
    }
  } catch (err: any) {
    response.error = err.message;
  }

  response.updatedAt = new Date();
  return json(response);
};
