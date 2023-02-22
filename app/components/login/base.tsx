import { VStack, Icon, Box, Text } from "@chakra-ui/react";
import LogoIcon from "~/components/icon/logo";

export default function OnboardingBase({
  title,
  description,
  accent = false,
  children,
}: {
  title: string;
  description: JSX.Element | string;
  accent?: boolean;
  children: JSX.Element | string;
}) {
  const descriptionColor = accent ? "pink.400" : "gray.400";

  return (
    <VStack
      borderRadius={"8px"}
      borderWidth={"1px"}
      borderColor={"gray.100"}
      borderStyle={"solid"}
      bgColor={"white"}
      p={8}
      maxW={"400px"}
      minW={"400px"}
    >
      <Icon as={LogoIcon} w={"135px"} h={"66px"} mb={6} />

      <Box w={"full"} h={"1px"} bgColor={"gray.100"} />

      <Text
        textAlign={"center"}
        pt={6}
        fontSize={"2xl"}
        fontWeight={"bold"}
        color={"gray.800"}
      >
        {title}
      </Text>

      <Text
        textAlign={"center"}
        color={descriptionColor}
        fontWeight={"normal"}
        fontSize={"sm"}
      >
        {description}
      </Text>

      {children}
    </VStack>
  );
}
