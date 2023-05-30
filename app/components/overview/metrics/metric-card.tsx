import { useEffect, useMemo, useState } from "react";
import { type SmartContract } from "darchlabs";
import { useFetcher } from "@remix-run/react";
import { useInterval } from "usehooks-ts";
import { type Metric, type OverviewMetricActionData } from "@routes/overview.metric.action";
import { FormatNumber } from "@utils/format-number";
import { MetricStatusCard } from "../metric-status-card";
import { useToast } from "@chakra-ui/react";
import { FormatEVM } from "@utils/format-evm";

export const MetricCard = ({
  text,
  metric,
  isError = false,
  contract,
}: {
  text: string;
  metric: Metric;
  isError?: boolean;
  contract: SmartContract;
}) => {
  // define hooks
  const fetcher = useFetcher();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("0" as string);

  // fetch for getting status at the first time
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      setIsLoading(true);
      fetcher.submit(
        { metric, address: contract.address },
        {
          method: "post",
          action: `/overview/metric/action`,
        }
      );
    }
  }, [fetcher, metric, contract.address]);

  // check if fetched is resolved and has data
  useEffect(() => {
    if (fetcher.state === "loading") {
      // if (fetcher.state === "submitting") {
      const actionData = fetcher.data as OverviewMetricActionData;
      if (actionData && actionData.metric === metric) {
        setIsLoading(false);

        // check if action data has error
        if (actionData.error) {
          toast({
            title: "Metric Error",
            description: actionData.error,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
          });

          return;
        }

        if (metric === "tvl") {
          setValue(FormatEVM(contract.network, actionData.value, 2));
          return;
        }
        setValue(FormatNumber(actionData.value));
      }
    }
  }, [fetcher.state, fetcher.data, metric, toast, contract.network]);

  // define interval for getting status every 10 seconds
  useInterval(() => {
    fetcher.submit(
      { metric, address: contract.address },
      {
        method: "post",
        action: `/overview/metric/action`,
      }
    );
  }, 10000);

  return <MetricStatusCard text={text} loading={isLoading} value={value} isError={isError} />;
};
