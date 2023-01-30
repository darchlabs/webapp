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

import { RiFilter2Fill, RiSortAsc, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useLocation, Link } from "@remix-run/react";
import NodeItem from "./node-item";
import type { Node } from "../../pkg/node/types";
import { MdNotListedLocation } from "react-icons/md";

function TableWithData({ nodeList }: { nodeList: Node[] }) {
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
            All nodes ({nodeList.length})
          </Text>
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
              <Th>Network</Th>
              <Th>Node id</Th>
              <Th>Port</Th>
              <Th>Origin</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {nodeList.map((node, _index) => (
              <NodeItem key={node.id} item={node} />
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
                  1-{nodeList.length} of {nodeList.length}
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

function EmptyTable(shouldShow: boolean = true) {
  if (!shouldShow) {
    return null;
  }

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
        Start by creating a Node
      </Heading>
      <Text fontSize="md" textAlign={"center"}>
        DarchLabs offers several networks and environments in order to run nodes.
      </Text>
      <Text fontSize="md" textAlign={"center"}>
        With us, you can enable your environments  and easy to run nodes for your project.
      </Text>

      <Button size={"sm"} colorScheme={"pink"}>
        <Link to={"/admin/nodes/create/network"}>
          CREATE NODE
        </Link>
      </Button>
    </VStack>
  );
}

export default function NodeTable({ nodeList }: { nodeList: Node[] }) {
  return !nodeList.length ? EmptyTable() : TableWithData({ nodeList });
}

