import { HStack, VStack, Text } from "@chakra-ui/react";
import type { Abi, SynchronizerBase } from "../../types";

export default function StepConfirm({ address }: SynchronizerBase, abi: Abi) {
  const addrStart = address.substring(0, 7);
  const addrEnd = address.substring(address.length - 5, address.length);
  const addr = `${addrStart}...${addrEnd}`;

  console.log("KAJAJAAJAJ");
  console.log("KAJAJAAJAJ");
  console.log("KAJAJAAJAJ");
  console.log("KAJAJAAJAJ", abi);

  return (
    <HStack w={"full"} alignItems={"space-between"}>
      <VStack w={"36%"} alignItems="stretch">
        <VStack alignItems={"start"} mb={"2px"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Synchronizer info
          </Text>

          <VStack alignItems={"start"} color={"gray.500"} fontSize={"14px"} spacing={"2px"}>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Network
              </Text>
              : Ethereum
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Address
              </Text>
              : {addr}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Event name
              </Text>
              : {abi.name}
            </Text>
          </VStack>
        </VStack>
      </VStack>

      <VStack w={"58%"} alignItems={"start"}>
        <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
          Confirm information before to create syncronizer
        </Text>

        <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
          Remember you can't change information about the synchronizer afterwards, so if you want to make changes,
          you'll need to delete it first and then create a new one.
        </Text>
      </VStack>
    </HStack>
  );
}
