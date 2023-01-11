import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Th,
  Tr,
  VStack,
  HStack,
  Text,
  Icon,
  Select,
  Stack,
  Button,
  Badge,
  Heading,
} from "@chakra-ui/react";

import {
  RiFilter2Fill,
  RiSortAsc,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import type { CronjobStatus } from "../../types";
import TableItem from "./table-item";
import { type Job } from "~/pkg/jobs/types";
import { Indexed } from "ethers/lib/utils";

function getColorSchemeByStatus(status: CronjobStatus): string {
  switch (status) {
    case "running":
      return "green";
    case "sync":
      return "yellow";
    case "error":
    case "stopped":
    case "stopping":
      return "red";
  }

  return "gray";
}

function TableWithData({ items }: { items: Job[] }) {
  return (
    <VStack
      w={"full"}
      maxW={"1000px"}
      alignItems={"start"}
      bg={"white"}
      border={"1px solid #DFE0EB"}
      borderRadius={"8px"}
    >
      <HStack
        w={"full"}
        p={"32px"}
        justifyContent={"space-between"}
        alignItems="start"
      >
        <VStack alignItems={"start"} spacing={1}>
          <Text fontWeight={"bold"} fontSize={"19px"}>
            All jobs ({items.length})
          </Text>
          <VStack alignItems={"start"} spacing={0.5}>
            <Text
              as={"span"}
              fontWeight={"normal"}
              fontSize={"14px"}
              color={"gray.400"}
            >
              Cronjob: Each {items[0].cronjob} seconds
            </Text>
            <HStack justifyContent={"center"}>
              <Text
                as={"span"}
                fontWeight={"normal"}
                fontSize={"14px"}
                color={"gray.400"}
              >
                Status:
              </Text>
              <Badge
                colorScheme={getColorSchemeByStatus(
                  items[0].status as CronjobStatus
                )}
                textTransform={"uppercase"}
              >
                {items[0].status}
              </Badge>
            </HStack>
          </VStack>
        </VStack>

        <HStack spacing={"24px"}>
          <HStack>
            <Button
              leftIcon={<Icon boxSize={5} color={"#C5C7CD"} as={RiSortAsc} />}
              colorScheme="pink"
              variant="ghost"
              color="#4B506D"
            >
              Sort
            </Button>
          </HStack>

          <HStack>
            <Button
              leftIcon={
                <Icon boxSize={5} color={"#C5C7CD"} as={RiFilter2Fill} />
              }
              colorScheme="pink"
              variant="ghost"
              color="#4B506D"
            >
              Filter
            </Button>
          </HStack>
        </HStack>
      </HStack>

      <TableContainer w={"full"}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Jobs Details</Th>
              <Th>Provider</Th>
              <Th>Network</Th>
              <Th>Cronjob</Th>
              <Th>Methods</Th>
              <Th>Last Updated</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <TableItem key={index} item={item} />
            ))}
          </Tbody>
          <TableCaption pt={0} mb={"8px"}>
            <HStack justifyContent={"end"} spacing={"15px"} mr={"24px"}>
              <HStack pr={"25px"}>
                <Text fontSize={"14px"} color={"#9FA2B4"}>
                  Rows per page:
                </Text>
                <Stack spacing={3}>
                  <Select
                    variant="unstyled"
                    size={"sm"}
                    placeholder="5"
                    color={"#4B506D"}
                  />
                </Stack>
              </HStack>
              <HStack pr={"10px"}>
                <Text fontSize={"14px"} color={"#9FA2B4"}>
                  1-{items.length} of {items.length}
                </Text>
              </HStack>
              <HStack>
                <Icon as={RiArrowLeftSLine} boxSize={5} color={"#9FA2B4"} />
              </HStack>
              <HStack>
                <Icon as={RiArrowRightSLine} boxSize={5} color={"#9FA2B4"} />
              </HStack>
            </HStack>
          </TableCaption>
        </Table>
      </TableContainer>
    </VStack>
  );
}

function EmptyTable() {
  return (
    <VStack
      w={"full"}
      maxW={"1000px"}
      alignItems={"center"}
      bg={"white"}
      border={"1px solid #DFE0EB"}
      borderRadius={"8px"}
      p={8}
      spacing={5}
    >
      <Heading as="h2" size="lg" textAlign={"center"}>
        Start by creating a Job
      </Heading>
      <Text fontSize="md" textAlign={"center"}>
        DarchLabs offers several networks and to run jobs.
      </Text>
      <Text fontSize="md" textAlign={"center"}>
        With us you can implement jobs that will allow you to perform
        transaction automatically in your smart contract. It will be based on a
        cronjob and on the smart contract logic.
      </Text>
    </VStack>
  );
}

export default function JobsTable({ items }: { items: Job[] }) {
  return !items.length ? EmptyTable() : TableWithData({ items });
}
{
  /* <Tr>
<Th key={"address"}>Jobs Details</Th>
<Th key={"provider"}>Provider</Th>
<Th key={"network"}>Network</Th>
<Th key={"cronjob"}>Cronjob</Th>
<Th key={"methods"}>Methods</Th>
<Th key={"lastUpdated"}>Last Updated</Th>
<Th></Th>
</Tr>
</Thead>
<Tbody>
{items.map((item, index) => (
<TableItem key={"provider"} item={item.providerId} />
))}
</Tbody> */
}
