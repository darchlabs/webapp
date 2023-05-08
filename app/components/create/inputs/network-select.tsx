import { Button, Menu, MenuButton, MenuItem, MenuList, Text, HStack } from "@chakra-ui/react";
import { type Network, NetworkInfo } from "darchlabs";
import { BsChevronDown } from "react-icons/bs";
import { GetNetworkAvatar } from "@utils/get-network-avatar";
import { useState } from "react";

export function NetworkSelectInput({
  form,
  value = "",
  error,
}: {
  form: string;
  value: string;
  error?: string;
}): JSX.Element {
  // define hooks
  const [network, setNetwork] = useState(value as Network);

  // define values
  const networks = Object.keys(NetworkInfo) as Network[];
  const color = error ? "red.500" : "blackAlpha.500";

  // define handlers
  function handleOnClick(n: Network) {
    setNetwork(n);
  }

  return (
    <>
      <input type="hidden" name={"network"} value={network} form={form} />
      <Text color={color} fontWeight={"semibold"} fontSize={"md"}>
        Network
      </Text>

      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<BsChevronDown />}
          px={4}
          py={2}
          w="full"
          bg={"white"}
          transition="all 0.2s"
          borderRadius={8}
          borderWidth={1.5}
          borderColor={color}
          textAlign={"left"}
          color={"blackAlpha.500"}
          size={"lg"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          {!network || network === ("" as Network) ? (
            <Text as={"span"}>Select a network</Text>
          ) : (
            <HStack>
              {GetNetworkAvatar(network, 7)}
              <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.600"}>
                {network}{" "}
                {NetworkInfo[network as Network].baseNetwork !== network ? (
                  <Text as="span" textTransform={"capitalize"}>
                    ({NetworkInfo[network as Network].baseNetwork})
                  </Text>
                ) : null}
              </Text>
            </HStack>
          )}
        </MenuButton>
        <MenuList>
          {networks.map((network, index) => {
            const info = NetworkInfo[network];
            return (
              <MenuItem key={index} minH="48px" onClick={() => handleOnClick(network)}>
                {GetNetworkAvatar(network, 7)}
                <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.800"}>
                  {network}{" "}
                  {info.baseNetwork !== network ? (
                    <Text as="span" textTransform={"capitalize"}>
                      ({info.baseNetwork})
                    </Text>
                  ) : null}
                </Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {error ? <Text color={color}>You must select a network</Text> : null}
    </>
  );
}