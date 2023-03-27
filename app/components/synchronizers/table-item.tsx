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
import { Form, useLocation, useSubmit } from "@remix-run/react";

import type { Synchronizer } from "../../pkg/synchronizer/types";

import { RiMore2Fill, RiStopCircleLine, RiPlayCircleLine } from "react-icons/ri";
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
  // load hooks
  const submit = useSubmit();
  const { pathname, search } = useLocation();

  const networkAvatar = GetNetworkAvatar(network);

  // define handlers
  function onClickHandler(action: string) {
    // prepare data to send in the form
    const formData = new FormData();
    formData.append("redirectURL", `${pathname}${search}`);
    formData.append("eventName", name);
    formData.append("address", address);

    // send form to delete event action
    submit(formData, {
      method: "post",
      action: `/admin/synchronizers/actions/${action}`,
    });
  }

  let action = null;
  if (status === "running") {
    action = (
      <MenuItem onClick={() => onClickHandler("stop")} icon={<RiStopCircleLine size={15} />}>
        Stop
      </MenuItem>
    );
  } else if (status === "error" || status === "stopped") {
    action = (
      <MenuItem onClick={() => onClickHandler("start")} icon={<RiPlayCircleLine size={15} />}>
        Start
      </MenuItem>
    );
  }

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
            {action}
            <MenuItem onClick={() => onClickHandler("delete")} icon={<BsTrash />}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}
