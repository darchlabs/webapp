import { Heading, VStack, Text, Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export function EmptyTable({ createLink }: { createLink: string }) {
  return (
    <VStack
      w={"full"}
      maxW={"1000px"}
      alignItems={"center"}
      bg={"white"}
      border={"1px solid #DFE0EB"}
      borderRadius={"8px"}
      p={8}
      spacing={5}
    >
      <Heading as="h2" size="lg" textAlign={"center"}>
        Start by creating a Synchronizer
      </Heading>
      <Text fontSize="md" textAlign={"center"}>
        DarchLabs offers several networks and to run nodes.
      </Text>
      <Text fontSize="md" textAlign={"center"}>
        With us you can implement synchronizers that will allow you to read the information from a smart contract and
        save it in an off-chain database for later use. In this way you can make more complex queries and in less time.
      </Text>

      <Link to={createLink}>
        <Button size={"sm"} colorScheme={"pink"}>
          CREATE SYNCHRONIZER
        </Button>
      </Link>
    </VStack>
  );
}
