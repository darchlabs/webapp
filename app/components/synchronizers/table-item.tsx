import {
  IconButton,
  Tr,
  Td,
  VStack,
  HStack,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Tooltip,
} from "@chakra-ui/react";

import type { Synchronizer } from "../../pkg/synchronizer/types";

import { RiMore2Fill, RiStopCircleLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";

import ShortAddress from "../../utils/short-address";

import { GetColorSchemeByStatus } from "../../utils/get-color-scheme-by-status";
import { GetNetworkAvatar } from "../../utils/get-network-avatar";

export function TableItem({
  item: {
    network,
    address,
    abi: { name },
    updatedAt,
    latestBlockNumber,
    status,
    error,
  },
}: {
  item: Synchronizer;
}) {
  const networkAvatar = GetNetworkAvatar(network);

  return (
    <Tr>
      <Td>
        <HStack spacing={"25px"}>
          <HStack>{networkAvatar}</HStack>
          <HStack>
            <VStack alignItems={"start"}>
              <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                {name}
              </Text>
              <Text fontSize={"14px"} color={"#C5C7CD"}>
                {ShortAddress(address)}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {network}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            Mainnet
          </Text>
        </VStack>
      </Td>
      <Td>
        <Tooltip label={error} placement="auto" isDisabled={error === ""} bg={"red.500"}>
          <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus(status)}>
            {status}
          </Badge>
        </Tooltip>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
            {new Date(updatedAt).toDateString()}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            Block: {latestBlockNumber}
          </Text>
        </VStack>
      </Td>
      <Td>
        <Menu>
          <MenuButton as={IconButton} variant="ghost" icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />} />
          <MenuList minW="0" w={"150px"}>
            <MenuItem icon={<RiStopCircleLine size={15} />}>Stop</MenuItem>
            <MenuItem icon={<BsTrash />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}
