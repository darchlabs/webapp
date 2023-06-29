import { Heading, VStack, Text, Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export function EmptyTable({ createLink }: { createLink: string }) {
  return (
    <VStack
      w={"full"}
      maxW={"1000px"}
      alignItems={"center"}
      bg={"white"}
      borderWidth={1}
      borderColor={"blackAlpha.200"}
      borderStyle={"solid"}
      borderRadius={8}
      p={12}
      spacing={5}
      color={"blackAlpha.700"}
    >
      <Heading as="h2" size="lg" textAlign={"center"}>
        Start by creating a Node
      </Heading>

      <Text fontSize="lg" textAlign={"center"}>
        We enable developers and organizations to effortlessly deploy and manage blockchain nodes for their
        decentralized applications (DApps).
      </Text>

      <Text fontSize="md" textAlign={"center"}>
        Our streamlined Node service simplifies the setup and maintenance of nodes, freeing developers from the burdens
        of infrastructure management and allowing them to focus on creating innovative DApps.
      </Text>

      <Link to={createLink}>
        <Button mt={7} size={"md"} colorScheme={"pink"} bgColor={"pink.400"}>
          CREATE NODE
        </Button>
      </Link>
    </VStack>
  );
}
