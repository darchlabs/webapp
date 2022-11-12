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
} from "@chakra-ui/react";

import { RiFilter2Fill, RiSortAsc, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import type { Cronjob, CronjobStatus } from "../../types";
import type { Synchronizer } from "../../pkg/synchronizer/types";
import TableItem from "./table-item";

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

export default function SynchronizerTable({ items, cronjob }: { items: Synchronizer[]; cronjob: Cronjob }) {
  return (
    <VStack
      w={"full"}
      maxW={"1000px"}
      alignItems={"start"}
      bg={"white"}
      border={"1px solid #DFE0EB"}
      borderRadius={"8px"}
    >
      <HStack w={"full"} p={"32px"} justifyContent={"space-between"} alignItems="start">
        <VStack alignItems={"start"} spacing={1}>
          <Text fontWeight={"bold"} fontSize={"19px"}>
            All synchronizers ({items.length})
          </Text>
          <VStack alignItems={"start"} spacing={0.5}>
            <Text as={"span"} fontWeight={"normal"} fontSize={"14px"} color={"gray.400"}>
              Cronjob: Each {cronjob.seconds} seconds
            </Text>
            <HStack justifyContent={"center"}>
              <Text as={"span"} fontWeight={"normal"} fontSize={"14px"} color={"gray.400"}>
                Status:
              </Text>
              <Badge colorScheme={getColorSchemeByStatus(cronjob.status)} textTransform={"uppercase"}>
                {cronjob.status}
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
              leftIcon={<Icon boxSize={5} color={"#C5C7CD"} as={RiFilter2Fill} />}
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
              <Th>Event Details</Th>
              <Th>Network</Th>
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
                  <Select variant="unstyled" size={"sm"} placeholder="5" color={"#4B506D"} />
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
