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

import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import StateGraph from "~/components/dashboard/state-graph";
import getReportGroup from "~/utils/get-report-group";
import { getHoursPeriodArr } from "~/utils/get-date-period-arr";
import getServiceInsights from "~/utils/get-service-insigths";

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
  jobsGroup: GroupReport[];
  // syncReport: Report[];
  // nodesReport: Report[];
};

export const loader: LoaderFunction = async () => {
  const jobsGroup = await getReportGroup("jobs");

  return { jobsGroup } as loaderData;
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
  const { jobsGroup } = useLoaderData() as loaderData;

  // get the time period data of 24 hours
  const hoursArray = getHoursPeriodArr(24);

  // get the jobs insight based on the service status in the given period
  const jobsInfo = getServiceInsights(jobsGroup, hoursArray.length);

  // calc total instances
  const totalInstances = 0 + 0 + jobsInfo.totalInstances;

  // Errors
  const syncErrors = 0;
  const nodesErrors = 0;
  const totalErrors = syncErrors + jobsInfo.totalErrors + nodesErrors;

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
          <Card title="Synchronizers" num={0} />
          <Card title="Jobs" num={jobsInfo.totalInstances} />
          <Card title="Nodes" num={0} />
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
              input={jobsInfo.dateWorkingState}
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
                {syncErrors}
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Jobs Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                {jobsInfo.totalErrors}
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Nodes Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                {nodesErrors}
              </Text>
            </VStack>
          </VStack>
        </HStack>
      </VStack>
    </>
  );
}
