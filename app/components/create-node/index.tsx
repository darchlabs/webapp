import { Button, HStack, VStack, Text, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Step } from "./steps";
import StepsComponent from "./steps";
import type { Network } from "../../types";
import type { NodeFormData } from "../../pkg/node/types";
import StepNetwork from "./step-network";
import StepBlockNumber from "./step-blocknumber";
import StepConfirm from "./step-confirm";
import { Link } from "@remix-run/react";

enum StepEnum {
  Network,
  BlockNumber,
  Confirm,
}

const steps: Step[] = [
  {
    text: "network",
  },
  {
    text: "block number",
  },
  {
    text: "confirm",
  },
];

export default function Create({ setShowCreateNode }: any) {
  const [currentStep, setCurrentStep] = useState(StepEnum.Network);
  const [network, setNetwork] = useState("none" as Network);
  const [blockNumber, setBlockNumber] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState({} as NodeFormData);
  const [fetchLoading, setFetchLoading] = useState(false);

  function nextOnClick() {
    if (currentStep !== StepEnum.Confirm) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // set loading true
    setFetchLoading(true);

    setInterval(() => {
      setFetchLoading(false);
    }, 3000);
  }

  function backOnClick() {
    setCurrentStep(currentStep - 1);
  }

  function cancelOnClick() {
    setShowCreateNode((prevState: boolean) => !prevState);
  }

  // check field content for every step and validate next/back button
  useEffect(() => {
    let valid = false;
    switch (currentStep) {
      case StepEnum.Network: {
        valid = network === "none" ? false : true;
        break;
      }
      case StepEnum.BlockNumber: {
        valid = Number.isInteger(blockNumber) ? true : false;
        break;
      }
      case StepEnum.Confirm: {
        valid = true;
        break;
      }
    }

    setIsDisabled(!valid);
  }, [currentStep, network, blockNumber, setIsDisabled]);

  // update formDate when any field are changed
  useEffect(() => {
    // check if change network value
    if (network !== formData.network) {
      setFormData({ ...formData, network });
    }
    // check if change block number
    if (blockNumber !== formData.fromBlockNumber) {
      setFormData({ ...formData, fromBlockNumber: blockNumber });
    }
  }, [network, blockNumber,  setFormData]);

  let section = null;
  switch (currentStep) {
    case StepEnum.Network:
      section = StepNetwork(network, setNetwork);
      break;
    case StepEnum.BlockNumber:
      section = StepBlockNumber(network, setBlockNumber);
      break;
    case StepEnum.Confirm:
      section = StepConfirm(formData, confirm)
      break;
  }

  return (
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
        <HStack w={"full"} justifyContent="space-between" alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"19px"}>
            Create Node
          </Text>
          <StepsComponent currentStep={currentStep} steps={steps} />
        </HStack>

        <Flex
          w={"full"}
          flexDirection={["column-reverse", "column-reverse", "row"]}
          justifyContent={"space-between"}
          alignItems={"start"}
        >
          {section}
        </Flex>
      </VStack>

      <HStack pt={"12px"} spacing={"10px"}>
        <Button
          isLoading={fetchLoading}
          loadingText="CREATING"
          disabled={isDisabled || fetchLoading}
          size={"sm"}
          colorScheme={"pink"}
          onClick={nextOnClick}
        >
          {currentStep === StepEnum.Confirm ? "CREATE" : "NEXT"}
        </Button>
        {currentStep > 0 ? (
          <Button disabled={fetchLoading} variant="outline" size={"sm"} colorScheme={"pink"} onClick={backOnClick}>
            BACK
          </Button>
        ) : null}
        <Link to="/dashaboard/nodes">
          <Button disabled={fetchLoading} size={"sm"} colorScheme={"pink"} variant={"ghost"}>
            Cancel
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
}

