import { useEffect, useRef, useState } from "react";
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
  Button,
} from "@chakra-ui/react";
import { useLocation, useFetcher } from "@remix-run/react";
import { RiMore2Fill, RiFileCopyLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { ShortAddress } from "@utils/short-address";
import { GetNetworkAvatar } from "@utils/get-network-avatar";
import { type Node, type NodesNetworkEnvironment } from "darchlabs";
import { GetColorSchemeByStatus } from "@utils/get-color-scheme-by-status";

export function TableItem({ item, urlOrigin }: { item: Node<NodesNetworkEnvironment>; urlOrigin: string }) {
  // define hooks
  const location = useLocation();
  const { pathname, search } = location;
  const [buttonText, setButtonText] = useState("Copy");

  const endpoint = `${urlOrigin}/nodes/jsonrpc/${item.id}`;

  const [isFetching, setIsFetching] = useState(false);
  const fetcher = useFetcher();

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
      action: `/nodes/action`,
    });
  }

  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      // Clipboard API not available
      return;
    }
    try {
      await navigator.clipboard.writeText(endpoint);
      setButtonText("Copied!");
      setTimeout(() => {
        setButtonText("Copy");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

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
                {ShortAddress(item.id)}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </Td>
      <Td>
        <VStack alignItems={"start"}>
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"} textTransform={"capitalize"}>
            {item.network}
          </Text>
          <Text fontSize={"14px"} color={"#C5C7CD"}>
            {item.environment}
          </Text>
        </VStack>
      </Td>
      <Td>
        <Badge textTransform={"uppercase"} colorScheme={GetColorSchemeByStatus(item.status)}>
          {item.status}
        </Badge>
      </Td>

      <Td>
        <HStack alignItems={"start"}>
          <Button
            rightIcon={<RiFileCopyLine />}
            colorScheme="pink"
            variant="outline"
            size={"sm"}
            onClick={copyToClipboard}
          >
            {buttonText}
          </Button>
          {/* <Text fontSize={"14px"} color={"#C5C7CD"}>
            http://www.google.cl
          </Text> */}
        </HStack>
      </Td>
      <Td>
        <Menu>
          <MenuButton as={IconButton} variant="ghost" icon={<Icon boxSize={5} color={"#C5C7CD"} as={RiMore2Fill} />} />
          <MenuList minW="0" w={"150px"}>
            <MenuItem icon={<BsTrash />} onClick={() => onClickHandler("delete")}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}
