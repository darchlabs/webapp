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

type Report = {
  id: string;
  status: string;
  createdAt: string;
  // createdAt: time.Time;
};

type GroupReport = {
  type: string;
  services: Report[][];
  createdAt: string;
  // createdAt: time.Time;
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

  const jeje: string[] = [];

  // sort it ascendently
  let lastKeyAdded = 0;
  // Filter by those reports that have 1 hour of difference
  lastDayKeys = lastDayKeys.sort((a, b) => a - b);
  const be = lastDayKeys.filter((key) => {
    if (key - lastKeyAdded > OneHour) {
      jeje.push(`${jobsPrefix}${key}`);
      lastKeyAdded = key;
    }

    return jeje;
  });

  const jobsGroup = (await redis.getBatch(jeje)) as GroupReport[];

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
  const jobsErrors: number[] = [];

  for (let i = 0; i++; i > jobsGroup.length) {
    const jobsPerReport = jobsGroup[i].services;

    const aLPHA = jobsPerReport.map((job) => {
      const errorPerHour = job.reduce((total, current) => {
        console.log("stats: ", current.status);
        return total + current.status === "error" ? 1 : 0;
      }, 0);
      jobsErrors.push(errorPerHour);
    });
  }

  console.log("jobsErrors: ", jobsErrors);

  // const nodesErrors = nodes.reduce(
  //   (total, current) =>
  //     total + current.status !== "running" || "stopped" ? 1 : 0,
  //   0
  // );
  // console.log("nodesErrors: ", nodesErrors);

  // // TODO: add errors from sync  when available the state
  const syncErrors = 0;
  const nodesErrors = 0;

  const totalErrors = syncErrors + 0 + nodesErrors;
  // const workingInstances = totalInstances - totalErrors;

  // const availabilityState = (workingInstances * 100) / totalInstances;

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
          <VStack alignItems={"stretch"} width={"66%"} p={"30px 0"}>
            <Text fontSize={"19px"} color={"#252733"} fontWeight={"bold"}>
              Status
            </Text>
            <HStack justifyContent={"space-between"}>
              <Text fontSize={"12px"} color={"#9FA2B4"}>
                Updated a few seconds ago
              </Text>
              <Text fontSize={"12px"} color={"#9FA2B4"}>
                ⚪ Today
              </Text>
              <Text fontSize={"12px"} color={"#9FA2B4"}>
                🔴 Yesterday
              </Text>
            </HStack>
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
                {jobsErrors}
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
