import { HStack, VStack, Text } from "@chakra-ui/react";
import type { Step } from "../../../components/create-node/steps";
import StepsComponent from "../../../components/create-node/steps";
import type { NodeFormData } from "../../../pkg/node/types";
import { Outlet, useLocation } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import { json } from "@remix-run/node";

enum StepEnum {
  network,
  blocknumber,
  confirm,
}

const steps: Step[] = [
  {
    text: "network",
  },
  {
    text: "Block number",
  },
  {
    text: "Confirm",
  },
];

export default function Create() {
  const { pathname } = useLocation();

  console.log("-------> inside create component");

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
              Create node
            </Text>
            <StepsComponent currentStep={currentStep} steps={steps} />
          </HStack>

          <Outlet />
        </VStack>
      </VStack>
    </HStack>
  );
}
