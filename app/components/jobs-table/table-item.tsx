import {
  IconButton,
  Tr,
  Td,
  VStack,
  HStack,
  Text,
  // Badge,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
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
import { cronMap } from "~/routes/admin/jobs/create/cron";
import { getColorSchemeByStatus } from "./table";

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
  },
  providers,
}: {
  item: Job;
  providers: Provider[];
}) {
  const networkAvatar = getNetworkAvatar(network);

  const getProviderName = (id: string): string => {
    let providerName = "";
    providers.map((provider) => {
      if (provider.id === id) {
        providerName = provider.name;
      }
      return providerName;
    });
    return providerName;
  };

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
            {getProviderName(providerId)}
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
            {cronMap[cronjob] ? cronMap[cronjob] : cronjob}
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
          <Badge
            colorScheme={getColorSchemeByStatus(status)}
            textTransform={"uppercase"}
          >
            {status}
          </Badge>
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
