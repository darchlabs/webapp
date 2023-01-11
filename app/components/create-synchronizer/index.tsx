import { Button, HStack, VStack, Text, Flex } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { utils } from "ethers";

import type { Step } from "./steps";
import StepsComponent from "./steps";
import type { Network } from "../../types";
import type { SynchronizerBase } from "../../pkg/synchronizer/types";
import StepAddress from "./step-address";
import StepNetwork from "./step-network";
import type { AbiForm } from "./step-abi";
import StepAbi from "./step-abi";
import StepConfirm from "./step-confirm";
import { Link } from "@remix-run/react";

enum StepEnum {
  Network,
  Address,
  ABI,
  Confirm,
}

const steps: Step[] = [
  {
    text: "network",
  },
  {
    text: "address",
  },
  {
    text: "ABI",
  },
  {
    text: "confirm",
  },
];

export default function Create({ setShowCreateSync }: any) {
  const [currentStep, setCurrentStep] = useState(StepEnum.Network);
  const [network, setNetwork] = useState("none" as Network);
  const [address, setAddress] = useState("");
  const [abi, setAbi] = useState({ valid: false, raw: "{}" } as AbiForm);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState({} as SynchronizerBase);
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
    setShowCreateSync((prevState: boolean) => !prevState);
  }

  // check field content for every step and validate next/back button
  useEffect(() => {
    let valid = false;
    switch (currentStep) {
      case StepEnum.Network: {
        valid = network === "none" ? false : true;
        break;
      }
      case StepEnum.Address: {
        valid = utils.isAddress(address) ? true : false;
        break;
      }
      case StepEnum.ABI: {
        valid = abi.valid;
        break;
      }
      case StepEnum.Confirm: {
        valid = true;
        break;
      }
    }

    setIsDisabled(!valid);
  }, [currentStep, network, address, abi, setIsDisabled]);

  // update formDate when any field are changed
  useEffect(() => {
    // check if change network value
    if (network !== formData.network) {
      setFormData({ ...formData, network });
    }
    // check if change address value
    if (address !== formData.address) {
      setFormData({ ...formData, address });
    }
    // check if change abi value
    if (abi.raw !== formData.raw) {
      setFormData({ ...formData, raw: abi.raw });
    }
  }, [network, address, abi, formData, setFormData]);

  let section = null;
  switch (currentStep) {
    case StepEnum.Network:
      section = StepNetwork(network, setNetwork);
      break;
    case StepEnum.Address:
      section = StepAddress(address, setAddress);
      break;
    case StepEnum.ABI:
      section = StepAbi(abi, setAbi);
      break;
    case StepEnum.Confirm:
      section = StepConfirm(formData, abi.data);
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
            Create Synchronizer
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
        <Link to="/dashaboard/synchronizers">
          <Button disabled={fetchLoading} size={"sm"} colorScheme={"pink"} variant={"ghost"}>
            Cancel
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
}
