import { Text } from "@chakra-ui/react";

export function TemplateTitleDescriptionHint({
  title,
  description,
  hint,
}: {
  title: string;
  description: string | JSX.Element;
  hint?: string | JSX.Element;
}) {
  return (
    <>
      <Text mb={3} color={"blackAlpha.800"} fontWeight={"bold"} lineHeight={5} fontSize={["md", "lg", "xl"]}>
        {title}
      </Text>
      <Text mb={hint ? 7 : 2} color={"gray.500"} fontWeight={"medium"} lineHeight={5} fontSize={["sm", "md"]}>
        {description}
      </Text>
      {hint ? (
        <Text color={"gray.500"} fontSize={["xs", "sm"]}>
          {hint}
        </Text>
      ) : null}
    </>
  );
}
