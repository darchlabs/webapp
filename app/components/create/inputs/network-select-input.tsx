import { Button, Menu, MenuButton, MenuItem, MenuList, Text, HStack } from "@chakra-ui/react";
import { type Network, NetworkInfo } from "darchlabs";
import { BsChevronDown } from "react-icons/bs";
import { GetNetworkAvatar } from "@utils/get-network-avatar";
import { useState } from "react";

export function NetworkSelectInput({
  form,
  value = "",
  error,
  networks,
}: {
  form: string;
  value: string;
  error?: string;
  networks?: Network[];
}): JSX.Element {
  if (networks && !Array.isArray(networks)) {
    throw new Error("networks array is not valid");
  }

  // define hooks
  const [network, setNetwork] = useState(value as Network);

  // define values
  const ns = networks ? networks : (Object.keys(NetworkInfo) as Network[]);
  const textColor = error ? "red.500" : "blackAlpha.500";
  const borderColor = error ? "red.500" : "blackAlpha.200";

  // define handlers
  function handleOnClick(n: Network) {
    setNetwork(n);
  }

  return (
    <>
      <input type="hidden" name={"network"} value={network} form={form} />
      <Text color={textColor} fontWeight={"semibold"} fontSize={"md"}>
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
          borderColor={borderColor}
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
                {NetworkInfo[network].name}{" "}
                {!NetworkInfo[network].mainnet ? (
                  <Text as="span" textTransform={"capitalize"}>
                    (Testnet)
                  </Text>
                ) : null}
              </Text>
            </HStack>
          )}
        </MenuButton>
        <MenuList>
          {ns.map((network, index) => {
            const info = NetworkInfo[network];
            return (
              <MenuItem key={index} minH="48px" onClick={() => handleOnClick(network)}>
                {GetNetworkAvatar(network, 7)}
                <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.800"}>
                  {NetworkInfo[network].name}{" "}
                  {!info.mainnet ? (
                    <Text as="span" textTransform={"capitalize"}>
                      (Testnet)
                    </Text>
                  ) : null}
                </Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {error ? <Text color={textColor}>You must select a network</Text> : null}
    </>
  );
}
