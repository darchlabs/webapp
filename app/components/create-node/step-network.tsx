import { HStack, VStack, Menu, MenuButton, MenuList, MenuItem, Button, Text, Show, Icon } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import type { Network } from "darchlabs";
import { EthereumAvatarIcon } from "@components/icon/ethereum-avatar";
import { PolygonSelectIcon } from "@components/icon/polygon-select-icon";

function getSelectedNetwork(network: Network) {
  if (network === "ethereum") {
    return (
      <HStack>
        <EthereumAvatarIcon mr="12px" borderRadius="full" boxSize={"1.5rem"} />
        <Text as={"span"} textTransform={"capitalize"}>
          Ethereum Mainnet
        </Text>
      </HStack>
    );
  }

  if (network === "polygon") {
    return (
      <HStack>
        <Icon as={PolygonSelectIcon} boxSize={"24px"} />
        <Text as={"span"} textTransform={"capitalize"}>
          Polygon Mainnet
        </Text>
      </HStack>
    );
  }

  return null;
}

export default function StepNetwork(network: Network, setNetwork: (n: Network) => void) {
  function onClick(network: Network) {
    setNetwork(network);
  }

  return (
    <>
      <VStack w={["full", "full", "36%"]} alignItems="stretch">
        <HStack justifyContent={"start"} mt={"10px"} mb={"2px"}>
          <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
            Network
          </Text>
        </HStack>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<BsChevronDown />}
            px={4}
            py={2}
            bg={"white"}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            textAlign={"left"}
            color={"gray.500"}
            size={"lg"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            {network === ("" as Network) ? <Text as={"span"}>Select a network</Text> : getSelectedNetwork(network)}
          </MenuButton>
          <MenuList>
            <MenuItem minH="48px" onClick={() => onClick("ethereum")}>
              <EthereumAvatarIcon mr="12px" borderRadius="full" boxSize={"1.5rem"} />
              <span>Ethereum Mainnet</span>
            </MenuItem>
            <MenuItem minH="48px" onClick={() => onClick("polygon")}>
              <Icon as={PolygonSelectIcon} boxSize={"24px"} />
              <span>Polygon Mainnet</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </VStack>

      <VStack w={["full", "full", "58%"]} alignItems={"start"}>
        <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
          First, select the network.
        </Text>

        <Show above="md">
          <Text fontWeight={"normal"} fontSize={"12px"} color={"gray.500"} pt={"15px"}>
            <Text as="span" fontWeight={"bold"} borderBottom={"1px dotted #9FA2B4"}>
              Hint
            </Text>
            : For now we are only accepting contracts on Ethereum and Polygon. Check the{" "}
            <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
              Roadmap
            </Text>{" "}
            to know the following networks.
          </Text>
        </Show>
      </VStack>
    </>
  );
}
