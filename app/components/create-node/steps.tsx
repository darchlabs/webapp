import { HStack, VStack, Icon, Text, Box, Show } from "@chakra-ui/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export type Step = {
  text: string;
};

function getColor(currentStep: number, index: number): [string, string] {
  const readyColor = "pink.500";
  const currentColor = "gray.500";
  const disabledColor = "gray.200";

  if (index < currentStep) {
    return [readyColor, readyColor];
  }

  if (index == currentStep) {
    return [currentColor, disabledColor];
  }

  return [disabledColor, disabledColor];
}

export default function Steps({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <VStack>
      <Show above="md">
        <HStack w={"full"} alignItems={"center"}>
          {steps.map((step, index) => {
            const [color, barColor] = getColor(currentStep, index);

            return (
              <HStack key={index} spacing={[null, null, 1, 1.5]} w={"30%"}>
                <HStack spacing={[null, null, 1.5, 2]}>
                  {index < currentStep ? (
                    <Icon as={IoIosCheckmarkCircleOutline} color={color} boxSize={[null, null, "30px", "35px"]} />
                  ) : (
                    <HStack
                      as={"span"}
                      borderRadius={"50%"}
                      borderColor={color}
                      borderWidth={"1.5px"}
                      borderStyle={"solid"}
                      w={[null, null, "25px", "30px"]}
                      h={[null, null, "25px", "30px"]}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Text as={"span"} color={color} fontSize={[null, null, "14px", "16px"]}>
                        {index + 1}
                      </Text>
                    </HStack>
                  )}
                  <Text
                    fontWeight={"normal"}
                    color={color}
                    textTransform={"capitalize"}
                    fontSize={[null, null, "14px", "16px"]}
                  >
                    {step.text}
                  </Text>
                </HStack>
                {index < steps.length - 1 ? <Box h={"2px"} bg={barColor} w={[null, null, 5, 8]} /> : null}
              </HStack>
            );
          })}
        </HStack>
      </Show>
      <Show below="md">
        <VStack alignItems={"end"} spacing={0}>
          <Text color={"gray.600"} fontWeight={"semibold"} fontSize={"18px"} textTransform={"capitalize"}>
            {steps[currentStep].text}
          </Text>
          <Text color={"gray.500"} fontWeight={"light"} fontSize={"14px"}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </VStack>
      </Show>
    </VStack>
  );
}
