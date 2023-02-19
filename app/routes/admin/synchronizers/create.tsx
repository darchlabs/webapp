import { HStack, VStack, Text } from "@chakra-ui/react";
import type { Step } from "../../../components/create-synchronizer/steps";
import StepsComponent from "../../../components/create-synchronizer/steps";
import type { SynchronizerFormData } from "../../../pkg/synchronizer/types";
import { Outlet, useLocation } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";

enum StepEnum {
  network,
  contract,
  event,
  confirm,
}

const steps: Step[] = [
  {
    text: "network",
  },
  {
    text: "contract",
  },
  {
    text: "event",
  },
  {
    text: "confirm",
  },
];

export default function Create() {
  const { pathname } = useLocation();

  const [, , , , step] = pathname.split("/");
  const index = Object.values(StepEnum).indexOf(step);
  const currentStep = index === -1 ? 0 : index;

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
      <VStack
        w={"full"}
        maxW={"1000px"}
        alignItems={"start"}
        bg={"white"}
        border={"1px solid #DFE0EB"}
        borderRadius={"8px"}
        p={["25px 32px 25px", "25px 32px 25px", "40px 32px 30px"]}
      >
        <VStack spacing={["15px", "15px", "35px"]} w={"full"}>
          <HStack
            w={"full"}
            justifyContent="space-between"
            alignItems={"start"}
          >
            <Text fontWeight={"bold"} fontSize={"19px"}>
              Create Synchronizer
            </Text>
            <StepsComponent currentStep={currentStep} steps={steps} />
          </HStack>

          <Outlet />
        </VStack>
      </VStack>
    </HStack>
  );
}
