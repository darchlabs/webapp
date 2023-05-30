import { CircularProgress, Flex, GridItem, Heading, Text } from "@chakra-ui/react";

export const ServiceStatusCard = ({
  text,
  loading,
  value,
  isError = false,
}: {
  text: string;
  loading: boolean;
  value: string;
  isError?: boolean;
}) => {
  const borderColor = isError ? "pink.400" : "blackAlpha.200";
  const titleColor = isError ? "pink.400" : "gray.400";
  const textColor = isError ? "pink.400" : "blackAlpha.800";

  return (
    <GridItem
      w="100%"
      bg="white"
      borderWidth={"1px"}
      borderStyle={"solid"}
      borderColor={borderColor}
      borderRadius={"8px"}
    >
      <Flex
        direction={["row", "column"]}
        p={["10% 10%", "8% 10%", "10% 10%", "8% 10%"]}
        alignItems={["center"]}
        justifyContent={"space-between"}
      >
        <Heading fontSize={["md", "sm", "lg", "lg"]} fontWeight={"semibold"} color={titleColor}>
          {text}
        </Heading>
        {loading ? (
          <CircularProgress mt={[0, 2]} isIndeterminate color="pink.400" size={"25px"} />
        ) : (
          <Text mt={[0, 1]} fontSize={["lg", "lg", "xl", "2xl"]} color={textColor} fontWeight={"bold"}>
            {value}
          </Text>
        )}
      </Flex>
    </GridItem>
  );
};
