import { HStack, VStack, Text, Input, Show } from "@chakra-ui/react";

export default function StepAddress(address: string, setAddress: (address: string) => void) {
  return (
    <>
      <VStack w={["full", "full", "36%"]} alignItems="stretch">
        <HStack justifyContent={"space-between"} mt={"10px"} mb={"2px"}>
          <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
            Block number
          </Text>
          <Text fontWeight={"normal"} fontSize={"14px"} color={"#ED64A6"} borderBottom={"1px dotted #ED64A6"}>
            My block number place holder
          </Text>
        </HStack>

        <Input
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          fontSize={"12px"}
          size={"md"}
          placeholder="0x..."
        ></Input>
      </VStack>

      <VStack w={["full", "full", "58%"]} alignItems={"start"}>
        <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Second, select the block number to fork your private chain.
        </Text>

        <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            If you want to fork the entire mainnet, use the original block which is 0.
        </Text>

        <Show above="md">
          <Text fontWeight={"normal"} fontSize={"12px"} color={"gray.500"} pt={"15px"}>
            <Text as="span" fontWeight={"bold"} borderBottom={"1px dotted #9FA2B4"}>
              Hint
            </Text>
            <Text as="span" fontWeight={"bold"}>
              : you can fork the network from an arbitrary block number which fits your needs.
            </Text>{" "}
            sidebar option.
          </Text>
        </Show>
      </VStack>
    </>
  );
}
