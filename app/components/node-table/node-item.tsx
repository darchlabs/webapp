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
  color,
  Button,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import type { Node } from "../../pkg/node/types";
import { StatusIcon } from "../status-icon/status-icon";
import { BsTrash } from "react-icons/bs";
import PolygonAvatar from "../icon/polygon-avatar";
import EthereumAvatar from "../icon/ethereum-avatar";
import BaseAvatar from "../icon/base-avatar";
import AvalancheAvatar from "../icon/avalanche-avatar";
import { RiMore2Fill, RiStopCircleLine } from "react-icons/ri";
import { useLoaderData } from "@remix-run/react";

function getNetworkAvatar(network: string) {
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

function getColorSchemeByStatus(status: string) {
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

export default function NodeItem({item: { id, chain, port, status, name, fromBlockNumber }, nodesURL }: {item: Node, nodesURL: string}) {
    const networkAvatar = getNetworkAvatar(chain);
    const colorBadge = getColorSchemeByStatus(status);
    console.log("00000000000 ", nodesURL)
    const { onCopy } = useClipboard(`${nodesURL}/jsonrpc/${id}`);
    const shortId = id.substring(0, 8);
    
    return (
        <Tr>
            <Td>
                <HStack spacing={"25px"}>
                    <HStack>{networkAvatar}</HStack>

                    <HStack>
                        <VStack alignItems={"start"}>
                            <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                                {/*insert name here also when name is available*/}
                                {chain}
                            </Text>
                            <Text fontWeight={"small"} fontSize={"12px"} color={"#718096"}>
                                {/*insert name here also when name is available*/}
                                {name}
                            </Text>
                        </VStack>
                    </HStack>
                </HStack>
            </Td>

            <Td>
                <HStack spacing={"12.5px"}>
                    <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                        {shortId}...
                    </Text>
                    <Button onClick={onCopy} size={"small"}>
                        <CopyIcon boxSize={5} color={"#C5C7CD"} />
                    </Button>
                </HStack>
            </Td>

            <Td>
                <HStack spacing={"25px"}>
                    <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                        {port}
                    </Text>
                </HStack>
            </Td>

            <Td>
                <HStack spacing={"25px"}>
                    <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                        {fromBlockNumber}
                    </Text>
                </HStack>
            </Td>

            <Td>
                <HStack>
                    <HStack alignItems={"start"}>
                        <StatusIcon status={status} color={colorBadge} />
                    </HStack>

                    <Menu>
                    <MenuButton as={IconButton} variant="ghost" icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />} />
                    <MenuList minW="0" w={"150px"}>
                        <MenuItem icon={<RiStopCircleLine size={15} />}>Start</MenuItem>
                        <MenuItem icon={<BsTrash />}>Stop</MenuItem>
                    </MenuList>
                    </Menu>
                </HStack>
            </Td>
        </Tr>
    );
}