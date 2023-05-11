import { CircularProgress, Flex, GridItem, Heading, Text } from "@chakra-ui/react";

export const ServiceStatusCard = ({
  title,
  loading,
  text,
  error = false,
}: {
  title: string;
  loading: boolean;
  text: string;
  error?: boolean;
}) => {
  const borderColor = error ? "pink.400" : "blackAlpha.200";
  const titleColor = error ? "pink.400" : "gray.400";
  const textColor = error ? "pink.400" : "blackAlpha.800";

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
          {title}
        </Heading>
        {loading ? (
          <CircularProgress mt={[0, 2]} isIndeterminate color="pink.400" size={"25px"} />
        ) : (
          <Text mt={[0, 1]} fontSize={["lg", "lg", "xl", "2xl"]} color={textColor} fontWeight={"bold"}>
            {text}
          </Text>
        )}
      </Flex>
    </GridItem>
  );
};
