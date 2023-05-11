import { Button, Menu, MenuButton, MenuItem, MenuList, Text, HStack } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import { GetProviderAvatar } from "@utils/get-provider-avatar";
import { type Provider } from "@models/jobs/types";
import { ToMap } from "@utils/to-map";

export function ProviderSelectInput({
  form,
  value = "",
  error,
  providers,
}: {
  form: string;
  value: string;
  error?: string;
  providers: Provider[];
}): JSX.Element {
  // define hooks
  const [providerId, setProviderId] = useState(value as string);

  // define values
  const textColor = error ? "red.500" : "blackAlpha.500";
  const borderColor = error ? "red.500" : "blackAlpha.200";
  const providerName = ToMap(providers)[providerId].name;

  // define handlers
  function handleOnClick(n: string) {
    setProviderId(n);
  }

  return (
    <>
      <input type="hidden" name={"providerId"} value={providerId} form={form} />
      <Text color={textColor} fontWeight={"semibold"} fontSize={"md"}>
        Provider
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
          {!providerId || providerId === "" ? (
            <Text as={"span"}>Select a provider</Text>
          ) : (
            <HStack>
              {GetProviderAvatar(providerName, 7)}
              <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.600"}>
                {providerName}
              </Text>
            </HStack>
          )}
        </MenuButton>
        <MenuList>
          {providers.map((provider, index) => {
            return (
              <MenuItem key={index} minH="48px" onClick={() => handleOnClick(provider.id)}>
                {GetProviderAvatar(provider.name, 7)}
                <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.800"}>
                  {provider.name}
                </Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {error ? <Text color={textColor}>You must select a provider</Text> : null}
    </>
  );
}
