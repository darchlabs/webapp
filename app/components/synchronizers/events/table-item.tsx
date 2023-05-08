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
import { useLocation, useSubmit } from "@remix-run/react";

import type { Event, EventAbi } from "darchlabs";

import { RiMore2Fill, RiStopCircleLine, RiPlayCircleLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";

import { ShortAddress, GetNetworkAvatar } from "@utils/index";
import { GetColorSchemeByStatus } from "../get-color-scheme-by-status";

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
  item: Event;
}) {
  // define hooks
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
      action: `/events/${action}/action`,
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
        <HStack spacing={6}>
          <HStack>{networkAvatar}</HStack>
          <HStack>
            <VStack alignItems={"start"}>
              <Text fontWeight={"medium"} fontSize={"md"} color={"blackAlpha.800"}>
                {name}
              </Text>
              <Text fontSize={"sm"} color={"blackAlpha.500"}>
                {ShortAddress(address)}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </Td>
      <Td>
        <Tooltip label={error} placement="auto" isDisabled={error === ""} bg={"blackAlpha.500"}>
          <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus(status)}>
            {status}
          </Badge>
        </Tooltip>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"md"} color={"blackAlpha.800"}>
            {new Date(updatedAt).toDateString()}
          </Text>
          <Text fontSize={"sm"} color={"blackAlpha.500"}>
            Block: {latestBlockNumber}
          </Text>
        </VStack>
      </Td>
      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            variant="ghost"
            icon={<Icon boxSize={5} color={"blackAlpha.500"} as={RiMore2Fill} />}
          />
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