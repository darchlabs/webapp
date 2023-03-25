import { Badge, HStack, VStack, Text } from "@chakra-ui/react";
import type { Cronjob } from "../../types";
import { GetColorSchemeByStatus } from "~/utils/get-color-scheme-by-status";

export function SubHeader({ cronjob }: { cronjob: Cronjob }) {
  return (
    <VStack alignItems={"start"} spacing={0.5}>
      <Text as={"span"} fontWeight={"normal"} fontSize={"14px"} color={"gray.400"}>
        Cronjob: Each {cronjob.seconds} seconds
      </Text>
      <HStack justifyContent={"center"}>
        <Text as={"span"} fontWeight={"normal"} fontSize={"14px"} color={"gray.400"}>
          Status:
        </Text>
        <Badge colorScheme={GetColorSchemeByStatus(cronjob.status)} textTransform={"uppercase"}>
          {cronjob.status}
        </Badge>
      </HStack>
    </VStack>
  );
}
