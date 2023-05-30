import { CircularProgress, Flex, GridItem, Heading, Text } from "@chakra-ui/react";

export const MetricStatusCard = ({
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
      colSpan={2}
      borderWidth={"1px"}
      borderStyle={"solid"}
      borderColor={borderColor}
      borderRadius={"8px"}
    >
      <Flex
        direction={["row"]}
        p={["10% 10%", "8% 10%", "10% 10%", "8% 10%"]}
        alignItems={["center"]}
        justifyContent={"space-between"}
        w={"full"}
        h={"full"}
      >
        <Heading fontSize={["md", "lg", "lg", "lg"]} fontWeight={"semibold"} color={titleColor}>
          {text}
        </Heading>

        {loading ? (
          <CircularProgress isIndeterminate color="pink.400" size={"25px"} />
        ) : (
          <Text ml={1} fontSize={["lg", "lg", "xl", "2xl"]} color={textColor} fontWeight={"bold"}>
            {value}
          </Text>
        )}
      </Flex>
    </GridItem>
  );
};
