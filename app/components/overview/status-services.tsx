import { Grid, VStack, Text } from "@chakra-ui/react";
import { ServiceStatusCard } from "./service-status-card";

import { useMediaQuery, theme } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useInterval } from "usehooks-ts";
import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { type OverviewStatusActionData } from "@routes/overview.status.action";

export const StatusServices = () => {
  // define hooks
  const fetcher = useFetcher();
  const [updatedAt, setUpdatedAt] = useState("" as string);
  const [isLoading, setIsLoading] = useState(true);
  const [BelowToSm] = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // define values
  const actionData = fetcher.data as OverviewStatusActionData;
  const synchronizers = !actionData
    ? "0"
    : `${actionData.synchronizers.working} / ${actionData.synchronizers.working + actionData.synchronizers.failed}`;
  const jobs = !actionData ? "0" : `${actionData.jobs.working} / ${actionData.jobs.working + actionData.jobs.failed}`;
  const nodes = !actionData
    ? "0"
    : `${actionData.nodes.working} / ${actionData.nodes.working + actionData.nodes.failed}`;
  const error = !actionData
    ? "0"
    : `${actionData.synchronizers.failed + actionData.jobs.failed + actionData.nodes.failed}`;

  // fetch for getting status at the first time
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      setIsLoading(true);
      fetcher.submit(null, {
        method: "post",
        action: `/overview/status/action`,
      });
    }
  }, [fetcher]);

  // check if fetched is resolved and has data
  useEffect(() => {
    if (fetcher.state === "loading") {
      const actionData = fetcher.data as OverviewStatusActionData;
      if (actionData) {
        setIsLoading(false);
        const distance = formatDistance(new Date(actionData.updatedAt), new Date());
        setUpdatedAt(distance);
      }
    }
  }, [fetcher]);

  // define interval for getting status every 10 seconds
  useInterval(() => {
    fetcher.submit(null, {
      method: "post",
      action: `/overview/status/action`,
    });
  }, 10000);

  return (
    <VStack borderRadius={"8px"} w={"full"}>
      <Grid width={"full"} templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={[3, 6]}>
        <ServiceStatusCard text={BelowToSm ? "Synchs" : "Synchronizers"} loading={isLoading} value={synchronizers} />
        <ServiceStatusCard text="Jobs" loading={isLoading} value={jobs} />
        <ServiceStatusCard text="Nodes" loading={isLoading} value={nodes} />
        <ServiceStatusCard text="Errors" loading={isLoading} isError={true} value={error} />
      </Grid>
      <VStack alignItems={"end"} width={"full"} pt={1}>
        <Text color="blackAlpha.500" fontSize={"sm"}>
          Updated at {updatedAt.toLowerCase()}
        </Text>
      </VStack>
    </VStack>
  );
};
