import React from "react";
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
  Badge,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import type { Node } from "../../pkg/node/types";
import { StatusIcon } from "../status-icon/status-icon";
import { BsTrash } from "react-icons/bs";
import PolygonAvatar from "../icon/polygon-avatar";
import EthereumAvatar from "../icon/ethereum-avatar";
import BaseAvatar from "../icon/base-avatar";
import AvalancheAvatar from "../icon/avalanche-avatar";
import {
  RiMore2Fill,
  RiPlayCircleFill,
  RiStopCircleLine,
} from "react-icons/ri";

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

export default function NodeItem({
  item: { id, chain, port, status, name, fromBlockNumber },
  nodesURL,
  nodeId,
  handlerNodeId,
}: {
  item: Node;
  nodesURL: string;
  nodeId: string;
  handlerNodeId: (id: string) => void;
}) {
  const networkAvatar = getNetworkAvatar(chain);
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
        <Badge
          textTransform={"uppercase"}
          colorScheme={getColorSchemeByStatus(status)}
        >
          {status}
        </Badge>
      </Td>

      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            variant="ghost"
            icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />}
          />
          <MenuList minW="0" w={"150px"}>
            <MenuItem
              type="submit"
              name="updateStatus"
              value="delete"
              icon={<BsTrash />}
              onClick={() => {
                handlerNodeId(id);
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
        <input type="hidden" name="nodeId" value={nodeId} />
      </Td>
    </Tr>
  );
}
