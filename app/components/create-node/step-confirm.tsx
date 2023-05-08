import { HStack, VStack, Text } from "@chakra-ui/react";
import { type Network } from "darchlabs";

export default function StepConfirm(network: Network, blockNumber: Number) {
  return (
    <HStack w={"full"} alignItems={"space-between"}>
      <VStack w={"36%"} alignItems="stretch">
        <VStack alignItems={"start"} mb={"2px"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Node info
          </Text>

          <VStack alignItems={"start"} color={"gray.500"} fontSize={"14px"} spacing={"2px"}>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Network
              </Text>
              : {network}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Block number :
              </Text>
              {blockNumber.toString()}
            </Text>
          </VStack>
        </VStack>
      </VStack>

      <VStack w={"58%"} alignItems={"start"}>
        <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
          Confirm information before to create Node
        </Text>

        <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
          Remember you can't change information about the synchronizer afterwards, so if you want to make changes,
          you'll need to delete it first and then create a new one.
        </Text>
      </VStack>
    </HStack>
  );
}
