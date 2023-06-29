import { useEffect, useState } from "react";
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
  CircularProgress,
  Tooltip,
} from "@chakra-ui/react";
import { Link, useLocation, useFetcher } from "@remix-run/react";

import { RiMore2Fill } from "react-icons/ri";
import { VscPieChart, VscDebugRestart } from "react-icons/vsc";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";

import { type EventStatus, type SmartContract } from "darchlabs";

import { ShortAddress } from "@utils/short-address";
import { GetNetworkAvatar } from "@utils/get-network-avatar";
import { GetColorSchemeByStatus } from "@utils/get-color-scheme-by-status";

export function TableItem({ item }: { item: SmartContract }) {
  // define hooks
  const { pathname, search } = useLocation();
  const fetcher = useFetcher();

  const [isFetching, setIsFetching] = useState(false);

  // define effects
  useEffect(() => {
    if (fetcher.formAction === "/synchronizers/delete/action") {
      const newIsFetching = fetcher.state === "submitting";
      if (isFetching != newIsFetching) {
        setIsFetching(newIsFetching);
      }
    }
  }, [fetcher, isFetching]);

  // define handlers
  function onClickHandler(action: string) {
    // prepare data to send in the form
    const formData = new FormData();
    formData.append("redirectURL", `${pathname}${search}`);
    formData.append("address", item.address);

    // send form to delete event action
    fetcher.submit(formData, {
      method: "post",
      action: `/synchronizers/${action}/action`,
    });
  }

  function checkIsFetching(e: any) {
    if (isFetching) {
      e.preventDefault();
    }
  }

  // define map status
  const mapStatus: { [key in EventStatus]: number } = {
    error: 0,
    synching: 0,
    stopped: 0,
    running: 0,
  };

  // count all event status of event
  for (let i = 0; i < item.events.length; i++) {
    const { status } = item.events[i];
    mapStatus[status]++;
  }

  return (
    <Tr>
      <Td>
        <Link to={`/events/${item.address}`} onClick={(e) => checkIsFetching(e)}>
          <HStack spacing={"25px"}>
            <HStack>
              {isFetching ? (
                <CircularProgress isIndeterminate color="pink.400" size={"44px"} />
              ) : (
                GetNetworkAvatar(item.network)
              )}
            </HStack>
            <HStack>
              <VStack alignItems={"start"}>
                <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
                  {item.name}
                </Text>
                <Text fontSize={"14px"} color={"#C5C7CD"}>
                  {ShortAddress(item.address)}
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </Link>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {item.network}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            Mainnet
          </Text>
        </VStack>
      </Td>
      <Td>
        <Tooltip label={item.error} placement="auto" isDisabled={item.error === ""} bg={"blackAlpha.800"}>
          <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus(item.status)}>
            {item.status}
          </Badge>
        </Tooltip>
      </Td>
      <Td>
        {/* <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
            {new Date(item.updatedAt).toDateString()}
          </Text>
        </VStack> */}

        <VStack>
          {mapStatus.error > 0 ? (
            <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus("error")}>
              {`${mapStatus.error} / error`}
            </Badge>
          ) : null}
          {mapStatus.synching > 0 ? (
            <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus("synching")}>
              {`${mapStatus.synching} / synching`}
            </Badge>
          ) : null}
          {mapStatus.stopped > 0 ? (
            <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus("stopped")}>
              {`${mapStatus.stopped} / stopped`}
            </Badge>
          ) : null}
          {mapStatus.running > 0 ? (
            <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus("running")}>
              {`${mapStatus.running} / running`}
            </Badge>
          ) : null}
        </VStack>
      </Td>
      <Td>
        <Menu>
          <MenuButton as={IconButton} variant="ghost" icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />} />
          <MenuList minW="0" w={"150px"}>
            {item.status === "error" || item.status === "quota_exceeded" ? (
              <MenuItem onClick={() => onClickHandler("restart")} icon={<VscDebugRestart />}>
                Restart
              </MenuItem>
            ) : null}
            <MenuItem icon={<VscPieChart />}>Metrics</MenuItem>
            <Link to={`/events/${item.address}`} onClick={(e) => checkIsFetching(e)}>
              <MenuItem icon={<HiOutlineDocumentText />}>Events</MenuItem>
            </Link>
            <MenuItem onClick={() => onClickHandler("delete")} icon={<BsTrash />}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}
