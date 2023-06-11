import { HStack, VStack, Text, Icon, Box, Show } from "@chakra-ui/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

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

export function Header({
  title,
  steps,
  currentIndex,
}: {
  title: string;
  steps: readonly string[];
  currentIndex: number;
}): JSX.Element {
  return (
    <HStack justifyContent={"space-between"} w={"full"} alignItems={"center"} mb={[3, 5, 7, 8]}>
      <Text fontWeight={"bold"} fontSize={["lg", "xl"]}>
        {title}
      </Text>
      <Box>
        <Show above="md">
          <HStack w={"full"} alignItems={"center"}>
            {steps.map((step, index) => {
              const [color, barColor] = getColor(currentIndex, index);

              return (
                <HStack key={index} spacing={[null, null, 1, 1.5]}>
                  <HStack spacing={[null, null, 1.5, 2]}>
                    {index < currentIndex ? (
                      <Icon as={IoIosCheckmarkCircleOutline} color={color} boxSize={[null, null, 8, 9]} />
                    ) : (
                      <HStack
                        as={"span"}
                        borderRadius={"50%"}
                        borderColor={color}
                        borderWidth={"1.5px"}
                        borderStyle={"solid"}
                        w={[null, null, 6, 8]}
                        h={[null, null, 6, 8]}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Text as={"span"} color={color} fontSize={[null, null, "sm", "md"]}>
                          {index + 1}
                        </Text>
                      </HStack>
                    )}
                    <Text
                      fontWeight={"normal"}
                      color={color}
                      textTransform={"capitalize"}
                      fontSize={[null, null, "lg", "lg"]}
                    >
                      {step as string}
                    </Text>
                  </HStack>
                  {index < steps.length - 1 ? <Box h={"2px"} bg={barColor} w={[null, null, 5, 5, 8]} /> : null}
                </HStack>
              );
            })}
          </HStack>
        </Show>
        <Show below="md">
          <VStack alignItems={"end"} spacing={0}>
            <Text color={"gray.600"} fontWeight={"semibold"} fontSize={["lg", "xl"]} textTransform={"capitalize"}>
              {steps[currentIndex] as string}
            </Text>
            <Text color={"gray.500"} fontWeight={"light"} fontSize={["sm", "md"]}>
              Step {currentIndex + 1} of {steps.length}
            </Text>
          </VStack>
        </Show>
      </Box>
    </HStack>
  );
}
