import { Text } from "@chakra-ui/react";

export function TemplateTitleTwoDescriptionsHint({
  title,
  description1,
  description2,
  hint,
}: {
  title: string;
  description1: string | JSX.Element;
  description2: string | JSX.Element;
  hint?: string | JSX.Element;
}) {
  return (
    <>
      <Text mb={5} color={"blackAlpha.800"} fontWeight={"bold"} lineHeight={5} fontSize={["md", "lg", "xl"]}>
        {title}
      </Text>
      <Text mb={7} color={"gray.500"} fontWeight={"medium"} lineHeight={5} fontSize={["sm", "md"]}>
        {description1}
      </Text>
      <Text mb={7} color={"gray.500"} fontWeight={"medium"} lineHeight={5} fontSize={["sm", "md"]}>
        {description2}
      </Text>
      {hint ? (
        <Text color={"gray.500"} fontSize={["xs", "sm"]}>
          {hint}
        </Text>
      ) : null}
    </>
  );
}
