import { Button, Menu, MenuButton, MenuItem, MenuList, Text, HStack, VStack } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";

export type SelectInputValue = {
  text: string;
  value: string;
};

export function SelectInput({
  name,
  title,
  placeholder,
  form,
  value = "",
  error,
  values,
}: {
  name: string;
  title?: string;
  placeholder: string;
  form: string;
  value: string;
  error?: string;
  values?: SelectInputValue[];
}): JSX.Element {
  if (!values || !Array.isArray(values)) {
    throw new Error("values array is not valid");
  }

  // define hooks
  const [data, setData] = useState(value as string);

  // define values
  const textColor = error ? "red.500" : "blackAlpha.500";
  const borderColor = error ? "red.500" : "blackAlpha.200";

  // define handlers
  function handleOnClick(n: string) {
    setData(n);
  }

  return (
    <VStack width="full" alignItems={"start"}>
      <input type="hidden" name={name} value={data} form={form} />

      {title ? (
        <Text color={textColor} fontWeight={"semibold"} fontSize={"md"} textTransform={"capitalize"}>
          {title}
        </Text>
      ) : null}

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
          {!data || data === "" ? (
            <Text as={"span"}>{placeholder}</Text>
          ) : (
            <HStack>
              <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.600"}>
                {data}
              </Text>
            </HStack>
          )}
        </MenuButton>
        <MenuList>
          {values.map((d, index) => {
            return (
              <MenuItem key={index} minH="48px" onClick={() => handleOnClick(d.value)}>
                <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.800"}>
                  {d.text}
                </Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {error ? <Text color={textColor}>{error}</Text> : null}
    </VStack>
  );
}
