import { Grid, VStack, Heading, HStack, Badge } from "@chakra-ui/react";
import { synchronizers } from "darchlabs";
import { MetricCard } from "./metrics/metric-card";
import { MetricChart } from "./metrics/metric-chart";
import { GetColorSchemeByStatus } from "@utils/get-color-scheme-by-status";
import { type Interval } from "@utils/intervals";

export const ContractMetrics = ({ contract }: { contract: synchronizers.Contract }) => {
  const intervalLeft: Interval = "6months";
  const intervalRight: Interval = "1month";

  return (
    <VStack borderRadius={"8px"} w={"full"} alignItems={"start"} spacing={5}>
      <HStack justifyContent={"start"} alignItems={"center"}>
        <Heading color={"blackAlpha.800"} fontSize={["xl", "xl", "2xl"]} fontWeight={"normal"} mr={5}>
          {contract.name}
        </Heading>
        <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus(contract.status)}>
          {contract.status}
        </Badge>
      </HStack>

      <Grid width={"full"} templateColumns={["repeat(4, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={[3, 6]}>
        <MetricCard text="Active Wallets" metric="active-addresses" contract={contract} />
        {/* <MetricCard text="TVL" metric="tvl" contract={contract} /> */}
        <MetricCard text="Events" metric="events" contract={contract} />
        <MetricCard text="Total Txs" metric="txs" contract={contract} />
        <MetricCard text="Success Txs" metric="success-txs" contract={contract} />
        <MetricCard text="Failed Txs" metric="failed-txs" contract={contract} isError={true} />
        <MetricCard text="Total Gas Spent" metric="total-gas-spent" contract={contract} />

        <MetricChart
          text="Gas Used"
          metric="historical-gas-used"
          type="line"
          contract={contract}
          customInterval={intervalLeft}
        />
        <MetricChart
          text="Interactions"
          metric="historical-gas-used"
          type="bar"
          contract={contract}
          customInterval={intervalRight}
        />

        {/* <MetricStatusCard text={"Total Value Transfered"} loading={isLoading} value={"3.1M"} />
            <MetricStatusCard text={"Total Gas Lost"} loading={isLoading} error={true} value={"1.1k"} /> */}
      </Grid>
      {/* <VStack alignItems={"end"} width={"full"}>
        <Text color="blackAlpha.500" fontSize={"sm"}>
          Updated at {updatedAt.toLowerCase()}
        </Text>
      </VStack> */}
    </VStack>
  );
};
