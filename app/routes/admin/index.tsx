import { HStack, VStack, Text, Heading, Grid, GridItem } from "@chakra-ui/react";
import HeaderDashboard from "../../components/header/dashboard";

// import type { ListEventsResponse } from "../../pkg/synchronizer/requests";
// import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

// import { json } from "@remix-run/node";
// import { synchronizer } from "../../pkg/synchronizer/synchronizer.server";

export const loader: LoaderFunction = async () => {
  // const data = await synchronizer.ListEvents();
  // return json(data as ListEventsResponse);

  return {};
};

const Card = ({ title, num, error = false }: { title: string; num: number; error?: boolean }) => {
  const borderColor = error ? "#D53F8C" : "#DFE0EB";
  const titleColor = error ? "#ED64A6" : "#9FA2B4";
  const textColor = error ? "#ED64A6" : "#252733";

  return (
    <GridItem w="100%" bg="white" border={`1px solid ${borderColor}`} borderRadius={"8px"}>
      <VStack p={["15% 10%", "10% 10%", "15% 10%", "10% 10%"]}>
        <Heading fontSize={["md", "sm", "lg", "lg"]} fontWeight={"semibold"} color={titleColor}>
          {title}
        </Heading>
        <Text fontSize={["lg", "lg", "xl", "2xl"]} color={textColor} fontWeight={"bold"}>
          {num}
        </Text>
      </VStack>
    </GridItem>
  );
};

export default function App() {
  // const items = useLoaderData<ListEventsResponse>();

  return (
    <>
      <HeaderDashboard title={"Overview"} />

      <VStack
        w={"full"}
        maxW={"1000px"}
        alignItems={"start"}
        borderRadius={"8px"}
        // bg={"white"}
        // border={"1px solid #DFE0EB"}
      >
        <Grid width={"full"} templateColumns="repeat(4, 1fr)" gap={6}>
          <Card title="Synchronizers" num={8} />
          <Card title="Jobs" num={16} />
          <Card title="Nodes" num={3} />
          <Card title="Errors" num={5} error={true} />
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
          <VStack bg={"red"} alignItems={"stretch"} width={"66%"} p={"30px 0"}>
            <Text fontSize={"19px"} color={"#252733"} fontWeight={"bold"}>
              Overview: DeFi for People
            </Text>
            <HStack justifyContent={"space-between"}>
              <Text fontSize={"12px"} color={"#9FA2B4"}>
                Updated a few seconds ago
              </Text>
              <Text fontSize={"12px"} color={"#9FA2B4"}>
                🔴 Yesterday
              </Text>
            </HStack>
          </VStack>
          <VStack
            bg={"green"}
            width={"33%"}
            height={"full"}
            borderLeft={"1px solid #DFE0EB"}
            // p={"30px 0"}
            alignItems={"stretch"}
            spacing={5}
          >
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Total Processes
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                27
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Synchronizers Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                2
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Jobs Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                1
              </Text>
            </VStack>
            <VStack alignItems={"center"} spacing={0}>
              <Text fontSize={"16px"} color={"#9FA2B4"} fontWeight={"semibold"}>
                Nodes Errors
              </Text>
              <Text fontSize={"24px"} color={"#252733"} fontWeight={"bold"}>
                0
              </Text>
            </VStack>
          </VStack>
        </HStack>
      </VStack>
    </>
  );
}
