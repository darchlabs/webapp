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
import { redis } from "~/pkg/redis/redis.server";
import getLastAndCurrentDay from "~/utils/get-last-day";
import StateGraph from "~/components/dashboard/state-graph";

type Report = {
  id: string;
  status: string;
  createdAt: string;
};

type GroupReport = {
  type: string;
  services: Report[];
  createdAt: string;
};

type loaderData = {
  // syncReport: Report[];
  jobsGroup: GroupReport[];
  // nodesReport: Report[];
};

// UNIX time is in seconds
const OneHour = 60 * 60; // 60 secs * 60 minutes

export const loader: LoaderFunction = async () => {
  const jobsPrefix = "group-reports:jobs:";
  // Get last day and now timestamps in UNIX time
  let [lastDay, now] = getLastAndCurrentDay();

  // get all reports form redis
  const jobsKeys = await redis.keys(`${jobsPrefix}*`);

  // filter for only last day reports
  let lastDayKeys: number[] = [];
  const a = jobsKeys.filter((key) => {
    const keyDate = Number(key.substring(jobsPrefix.length));
    const keyDateLen = keyDate.toString().length;

    now = Number(now.toString().substring(0, keyDateLen));
    lastDay = Number(lastDay.toString().substring(0, keyDateLen));

    // adding an hiur for assuring we'll get at least 24 reports with an hour of difference
    if (keyDate >= lastDay + OneHour && keyDate <= now) {
      lastDayKeys.push(keyDate);
    }
    return lastDayKeys;
  });

  const keysBatch: string[] = [];

  // sort it ascendently
  let lastKeyAdded = 0;
  // Filter by those reports that have 1 hour of difference
  lastDayKeys = lastDayKeys.sort((a, b) => a - b);
  const be = lastDayKeys.filter((key) => {
    if (key - lastKeyAdded > OneHour) {
      keysBatch.push(`${jobsPrefix}${key}`);
      lastKeyAdded = key;
    }

    return keysBatch;
  });

  const jobsGroup = (await redis.getBatch(keysBatch)) as GroupReport[];

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
  // calc total instances
  const totalInstances = 0;
  // syncReport.length + jobsReport.length + nodesReport.length;

  console.log("---> app: ", jobsGroup.length);

  // get total errors
  const workingPercentages: number[] = [];
  const hour: string[] = [];

  jobsGroup.forEach((jobReport) => {
    console.log("jobsReport: ", jobReport);
    const jobsReports = jobReport.services;
    console.log("createadat : ", jobReport.createdAt);
    const reportHour = new Date(jobReport.createdAt);
    const totalJobs = jobsReports.length;

    let errors = 0;
    jobsReports.forEach((job) => {
      if (job.status === "error" || job.status === "autoStopped") {
        errors += 1;
      }
    });

    const errorsPercentage = (errors * 100) / totalJobs;
    const runningPercentage = 100 - errorsPercentage;

    workingPercentages.push(runningPercentage);
    hour.push(reportHour.getHours().toString());
  });

  console.log("---:> loader: ", workingPercentages);
  console.log("---:> loader: ", hour);

  const syncErrors = 0;
  const nodesErrors = 0;

  const totalErrors = syncErrors + 0 + nodesErrors;

  const hoursArray: string[] = [];
  const working: number[] = [];
  for (let i = 0; i < 25; i++) {
    hoursArray.push((i % 25).toString().padStart(2, "0"));
    working.push(i + 60);
  }
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
          <Card title="Jobs" num={0} />
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
            <StateGraph input={working} labels={hoursArray}></StateGraph>
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
                {0}
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
