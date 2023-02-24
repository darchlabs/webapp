import {
  HStack,
  VStack,
  Text,
  Heading,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import HeaderDashboard from "../../components/header/dashboard";

// import type { ListEventsResponse } from "../../pkg/synchronizer/requests";
// import { useLoaderData } from "@remix-run/react";

import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import StateGraph from "~/components/dashboard/state-graph";
import getReportGroup from "~/utils/get-report-group";
import { getHoursPeriodArr } from "~/utils/get-date-period-arr";
import {
  getAllServicesInsight,
  getServiceInsights,
} from "~/utils/get-service-insigths";
import { requireUserId } from "~/session.server";

type Report = {
  id: string;
  status: string;
  createdAt: string;
};

export type GroupReport = {
  type: string;
  reports: Report[];
  createdAt: string;
};

type loaderData = {
  jobsGroup: GroupReport[] | undefined;
  syncGroup: GroupReport[] | undefined;
  nodesGroup: GroupReport[] | undefined;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const syncGroup = await getReportGroup("synchronizers");
  const jobsGroup = await getReportGroup("jobs");
  const nodesGroup = await getReportGroup("nodes");

  return { jobsGroup, syncGroup, nodesGroup } as loaderData;
};

const Card = ({
  title,
  num,
  error = false,
}: {
  title: string;
  num: number;
  error?: boolean;
}) => {
  const borderColor = error ? "#D53F8C" : "#DFE0EB";
  const titleColor = error ? "#ED64A6" : "#9FA2B4";
  const textColor = error ? "#ED64A6" : "#252733";

  return (
    <GridItem
      w="100%"
      bg="white"
      border={`1px solid ${borderColor}`}
      borderRadius={"8px"}
    >
      <VStack p={["15% 10%", "10% 10%", "15% 10%", "10% 10%"]}>
        <Heading
          fontSize={["md", "sm", "lg", "lg"]}
          fontWeight={"semibold"}
          color={titleColor}
        >
          {title}
        </Heading>
        <Text
          fontSize={["lg", "lg", "xl", "2xl"]}
          color={textColor}
          fontWeight={"bold"}
        >
          {num}
        </Text>
      </VStack>
    </GridItem>
  );
};

export default function App() {
  const { syncGroup, jobsGroup, nodesGroup } = useLoaderData() as loaderData;

  // get the time period data of 24 hours and its length
  const hoursArray = getHoursPeriodArr(24);
  const hoursArrayLen = hoursArray.length;

  // get the services insight based on the service status in the given period
  const syncInfo = getServiceInsights(syncGroup, hoursArrayLen);
  const jobsInfo = getServiceInsights(jobsGroup, hoursArrayLen);
  const nodesInfo = getServiceInsights(nodesGroup, hoursArrayLen);

  // Get the last report based on the actual hour
  const lastReport = new Date(Date.now()).getHours();

  // calc total instances and errors
  const totalInstances =
    syncInfo.totalInstances[lastReport] +
    jobsInfo.totalInstances[lastReport] +
    nodesInfo.totalInstances[lastReport];
  const totalErrors =
    syncInfo.totalErrors[lastReport] +
    jobsInfo.totalErrors[lastReport] +
    nodesInfo.totalErrors[lastReport];

  const allServicesState = getAllServicesInsight(
    hoursArray,
    syncInfo,
    jobsInfo,
    nodesInfo
  );

  return (
    <>
      <HeaderDashboard title={"Overview"} linkTo={""} />

      <VStack
        w={"full"}
        maxW={"1000px"}
        alignItems={"start"}
        borderRadius={"8px"}
        // bg={"white"}
        // border={"1px solid #DFE0EB"}
      >
        <Grid width={"full"} templateColumns="repeat(4, 1fr)" gap={6}>
          <Card
            title="Synchronizers"
            num={syncInfo.totalInstances[lastReport]}
          />
          <Card title="Jobs" num={jobsInfo.totalInstances[lastReport]} />
          <Card title="Nodes" num={nodesInfo.totalInstances[lastReport]} />
          <Card title="Errors" num={totalErrors} error={true} />
        </Grid>

        <HStack
          w={"full"}
          maxW={"1000px"}
          alignItems={"start"}
          borderRadius={"8px"}
          bg={"white"}
          border={"1px solid #DFE0EB"}
          p={"0 32px"}
        >
          <VStack alignItems={"stretch"} width={"100%"} p={"30px 0"}>
            <Text fontSize={"19px"} color={"#252733"} fontWeight={"bold"}>
              Status
            </Text>
            <HStack justifyContent={"space-between"}>
              <Text fontSize={"12px"} color={"#9FA2B4"}>
                Updated a few seconds ago
              </Text>
            </HStack>
            <StateGraph
              input={allServicesState}
              labels={hoursArray}
            ></StateGraph>
          </VStack>
          <VStack
            // bg={"green"}
            width={"33%"}
            height={"full"}
            borderLeft={"1px solid #DFE0EB"}
            // p={"30px 0"}
            alignItems={"stretch"}
            spacing={5}
            color={"red"}
          >
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Total Processes
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                {totalInstances}
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Synchronizers Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                {syncInfo.totalErrors[lastReport]}
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Jobs Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                {jobsInfo.totalErrors[lastReport]}
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Nodes Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                {nodesInfo.totalErrors[lastReport]}
              </Text>
            </VStack>
          </VStack>
        </HStack>
      </VStack>
    </>
  );
}
