import { HStack, VStack, Text, Input, Show } from "@chakra-ui/react";

export default function StepAddress(address: string, setAddress: (address: string) => void) {
  return (
    <>
      <VStack w={["full", "full", "36%"]} alignItems="stretch">
        <HStack justifyContent={"space-between"} mt={"10px"} mb={"2px"}>
          <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
            Contract address
          </Text>
          <Text fontWeight={"normal"} fontSize={"14px"} color={"#ED64A6"} borderBottom={"1px dotted #ED64A6"}>
            My addresses
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
          Second, insert the address of the contract.
        </Text>

        <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
          Remember that if your contract is not verified, you will have to enter the ABI manually, inserting only the
          object related to the event.
        </Text>

        <Show above="md">
          <Text fontWeight={"normal"} fontSize={"12px"} color={"gray.500"} pt={"15px"}>
            <Text as="span" fontWeight={"bold"} borderBottom={"1px dotted #9FA2B4"}>
              Hint
            </Text>
            : if you have associated a wallet, you can make use of{" "}
            <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
              aliases
            </Text>{" "}
            to make it easier to work with contract addresses. See{" "}
            <Text as="span" fontWeight={"bold"}>
              Addreses
            </Text>{" "}
            sidebar option.
          </Text>
        </Show>
      </VStack>
    </>
  );
}
