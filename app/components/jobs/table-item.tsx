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
import { useLocation, useFetcher } from "@remix-run/react";
import { RiMore2Fill, RiStopCircleLine, RiPlayCircleFill } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { ShortAddress } from "@utils/short-address";
import { GetNetworkAvatar } from "@utils/get-network-avatar";
import { type Job } from "@models/jobs/types";
import { CronjobValues } from "@utils/jobs-cron-utils";
import { GetColorSchemeByStatus } from "@utils/get-color-scheme-by-status";

// const timeDifference = (date: string): string => {
//   const difference = Date.now() - new Date(date).getDate();
//   return new Date(difference).toDateString();
// };

export function TableItem({ item, providerName }: { item: Job; providerName: string }) {
  // define hooks
  const { pathname, search } = useLocation();
  const [isFetching, setIsFetching] = useState(false);
  const fetcher = useFetcher();

  // get latest log
  const latestLog = item.logs ? <Text>{item.logs[item.logs.length - 1]}</Text> : "There are no logs";

  // format cronjob with templates
  let cron = item.cronjob;
  const cronTemplate = CronjobValues.find((c) => c.value === cron);
  if (cronTemplate) {
    cron = cronTemplate.text;
  }

  // define effects
  useEffect(() => {
    const newIsFetching = fetcher.state === "submitting";
    if (isFetching != newIsFetching) {
      setIsFetching(newIsFetching);
    }
  }, [fetcher, isFetching]);

  // define handlers
  function onClickHandler(action: string) {
    // prepare data to send in the form
    const formData = new FormData();
    formData.append("action", action);
    formData.append("redirectURL", `${pathname}${search}`);
    formData.append("id", item.id);

    // send form to delete event action
    fetcher.submit(formData, {
      method: "post",
      action: `/jobs/action`,
    });
  }

  return (
    <Tr>
      <Td>
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
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {providerName}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {item.network}
          </Text>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {item.type}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {cron}
          </Text>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {item.actionMethod + "()"}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {item.checkMethod + "()"}
          </Text>
        </VStack>
      </Td>
      {/* <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {item.updatedAt !== "" ? new Date(item.updatedAt).toDateString() : new Date(item.createdAt).toDateString()}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {item.updatedAt ? timeDifference(item.updatedAt) : timeDifference(item.createdAt)}
          </Text>
        </VStack>
      </Td> */}
      <Td>
        <Tooltip
          label={latestLog}
          placement="auto"
          isDisabled={!(item.status === "error" || item.status === "autoStopped")}
          bg={"blackAlpha.800"}
        >
          <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus(item.status)}>
            {item.status}
          </Badge>
        </Tooltip>
      </Td>
      <Td>
        <Menu>
          <MenuButton as={IconButton} variant="ghost" icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />} />
          <MenuList minW="0" w={"150px"}>
            {item.status === "running" ? (
              <MenuItem icon={<RiStopCircleLine size={15} />} onClick={() => onClickHandler("stop")}>
                Stop
              </MenuItem>
            ) : (
              <MenuItem icon={<RiPlayCircleFill size={15} />} onClick={() => onClickHandler("start")}>
                Start
              </MenuItem>
            )}
            <MenuItem icon={<BsTrash />} onClick={() => onClickHandler("delete")}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}
