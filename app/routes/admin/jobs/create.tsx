import { HStack, VStack, Text } from "@chakra-ui/react";

import type { Step } from "../../../components/create-node/steps";
import StepsComponent from "../../../components/create-node/steps";
import { Outlet, useLocation } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

enum StepEnum {
  Provider,
  Network,
  Address,
  Cron,
  Methods,
  Confirm,
}

const steps: Step[] = [
  {
    text: "Providers",
  },
  {
    text: "Networks",
  },
  {
    text: "Address",
  },
  {
    text: "Cron",
  },
  {
    text: "Methods",
  },
  {
    text: "Confirm",
  },
];

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists

  return json({});
};

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
