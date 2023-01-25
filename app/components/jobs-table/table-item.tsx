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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Button,
  usePopover,
  Box,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
} from "@chakra-ui/react";

import type { Network } from "../../types";
import type { Job, Provider } from "../../pkg/jobs/types";
import PolygonAvatar from "../icon/polygon-avatar";
import EthereumAvatar from "../icon/ethereum-avatar";
import AvalancheAvatar from "../icon/avalanche-avatar";
import BaseAvatar from "../icon/base-avatar";

import { RiMore2Fill, RiStopCircleLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";

import ShortAddress from "../../utils/short-address";
import { cronMap } from "~/routes/admin/jobs/utils/cron-utils";
import { getColorSchemeByStatus } from "./table";
import getProviderName from "~/routes/admin/jobs/utils/provider-name";
import { useState } from "react";

function getNetworkAvatar(network: Network) {
  switch (network) {
    case "polygon":
      return <PolygonAvatar boxSize={12} />;
    case "ethereum":
      return <EthereumAvatar boxSize={12} />;
    case "avalanche":
      return <AvalancheAvatar boxSize={12} />;
  }

  return <BaseAvatar boxSize={12} />;
}

export default function TableItem({
  item: {
    name,
    providerId,
    network,
    address,
    type,
    cronjob,
    checkMethod,
    actionMethod,
    createdAt,
    updatedAt,
    status,
    logs,
  },
  providers,
}: {
  item: Job;
  providers: Provider[];
}) {
  const networkAvatar = getNetworkAvatar(network);

  const timeDifference = (date: string): string => {
    const difference = Date.now() - new Date(date).getDate();
    return new Date(difference).toDateString();
  };

  return (
    <Tr>
      <Td>
        <HStack spacing={"25px"}>
          <HStack>{networkAvatar}</HStack>
          <HStack>
            <VStack alignItems={"start"}>
              <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                {name.slice(0, 12)}
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
          <Text
            fontWeight={"medium"}
            fontSize={"16px"}
            color={"#252733"}
            textTransform={"capitalize"}
          >
            {getProviderName(providers, providerId)}
          </Text>
          <Text
            fontSize={"14px"}
            color={"#C5C7CD"}
            textTransform={"capitalize"}
          >
            {network}
          </Text>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text
            fontWeight={"medium"}
            fontSize={"16px"}
            color={"#252733"}
            textTransform={"capitalize"}
          >
            {type}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {cronMap.has(cronjob) ? cronMap.get(cronjob) : cronjob}
          </Text>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
            {actionMethod + "()"}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {checkMethod + "()"}
          </Text>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
            {updatedAt !== ""
              ? new Date(updatedAt).toDateString()
              : new Date(createdAt).toDateString()}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {updatedAt ? timeDifference(updatedAt) : timeDifference(createdAt)}
          </Text>
        </VStack>
      </Td>
      <Td>
        <VStack>
          {status !== "running" ? (
            <Popover placement="auto">
              <PopoverTrigger>
                <Button colorScheme={getColorSchemeByStatus(status)}>
                  <Badge
                    colorScheme={`${getColorSchemeByStatus(status)}.400`}
                    textTransform={"uppercase"}
                  >
                    {status}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight="semibold">
                  Last Job Log
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody boxSize={"auto"}>
                  {logs ? (
                    <Flex>
                      <Text>{logs[logs.length - 1]}</Text>
                    </Flex>
                  ) : (
                    "There are no logs"
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Badge
              textTransform={"uppercase"}
              colorScheme={getColorSchemeByStatus(status)}
            >
              {status}
            </Badge>
          )}
        </VStack>
      </Td>
      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            variant="ghost"
            icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />}
          />
          <MenuList minW="0" w={"150px"}>
            <MenuItem icon={<RiStopCircleLine size={15} />}>Stop</MenuItem>
            <MenuItem icon={<BsTrash />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}
