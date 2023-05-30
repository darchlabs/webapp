import { Input, Button, Menu, MenuButton, MenuItem, MenuList, Text, HStack, VStack } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";

export type SelectInputValue = {
  text: string;
  value: string;
};

export function SelectCustomInput({
  name,
  title,
  customText,
  placeholderSelect,
  placeholderInput,
  form,
  value = "",
  error,
  values,
}: {
  name: string;
  title: string;
  customText: string;
  placeholderSelect: string;
  placeholderInput: string;
  form: string;
  value: string;
  error?: string;
  values?: SelectInputValue[];
}): JSX.Element {
  if (values && !Array.isArray(values)) {
    throw new Error("values array is not valid");
  }

  // check if current data is not custom
  // maybe we can find in map?? and set true?
  const isCustomDefault = values && values.length > 0 ? false : true;

  // define hooks
  const [data, setData] = useState(value as string);
  const [isCustom, setIsCustom] = useState(isCustomDefault as boolean);

  // define values
  const textColor = error ? "red.500" : "blackAlpha.500";
  const borderColor = error ? "red.500" : "blaclAlpha.200";

  // define handlers
  function handleOnClick(n: string) {
    setData(n);
  }
  function handleCustomOnClick() {
    setData("");
    setIsCustom(!isCustom);
  }

  return (
    <VStack width="full" alignItems={"start"}>
      <HStack width={"full"} justifyContent={"space-between"}>
        <Text color={textColor} fontWeight={"semibold"} fontSize={"md"} textTransform={"capitalize"}>
          {title}
        </Text>
        {isCustom && values && values.length > 0 ? (
          <Text
            color={"pink.400"}
            textDecoration={"underline"}
            textDecorationStyle={"dotted"}
            cursor={"pointer"}
            onClick={() => handleCustomOnClick()}
          >
            Templates
          </Text>
        ) : null}
      </HStack>

      {!isCustom ? (
        <>
          <input type="hidden" name={name} value={data} form={form} />
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
                <Text as={"span"}>{placeholderSelect}</Text>
              ) : (
                <HStack>
                  <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.600"}>
                    {data}
                  </Text>
                </HStack>
              )}
            </MenuButton>
            <MenuList>
              {values &&
                values.map((d, index) => {
                  return (
                    <MenuItem key={index} minH="48px" onClick={() => handleOnClick(d.value)}>
                      <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.800"}>
                        {d.text}
                      </Text>
                    </MenuItem>
                  );
                })}
              <MenuItem minH="48px" onClick={() => handleCustomOnClick()}>
                <Text textTransform={"capitalize"} ml={4} color={"blackAlpha.800"}>
                  {customText}
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <Input
          size="lg"
          isInvalid={!!error}
          errorBorderColor="red.500"
          focusBorderColor={"pink.400"}
          name={name}
          value={data}
          form={form}
          placeholder={placeholderInput}
          onChange={(ev) => setData(ev.target.value)}
        />
      )}

      {error ? <Text color={textColor}>{error}</Text> : null}
    </VStack>
  );
}
