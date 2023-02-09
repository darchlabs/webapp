import { HStack, VStack, Text } from "@chakra-ui/react";

import type { Step } from "../../../components/create-node/steps";
import StepsComponent from "../../../components/create-synchronizer/steps";
import { Outlet, useLocation } from "@remix-run/react";

enum StepEnum {
  provider,
  contract,
  methods,
  cron,
  account,
  confirm,
}

const steps: Step[] = [
  {
    text: "Provider",
  },
  {
    text: "Contract",
  },
  {
    text: "Methods",
  },
  {
    text: "Cron",
  },
  {
    text: "Account",
  },
  {
    text: "Confirm",
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
              Create Job
            </Text>
            <StepsComponent currentStep={currentStep} steps={steps} />
          </HStack>

          <Outlet />
        </VStack>
      </VStack>
    </HStack>
  );
}
