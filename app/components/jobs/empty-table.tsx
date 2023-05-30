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
      borderColor={"gray.300"}
      borderStyle={"solid"}
      borderRadius={8}
      p={12}
      spacing={5}
      color={"blackAlpha.700"}
    >
      <Heading as="h2" size="lg" textAlign={"center"}>
        Start by creating a Job.
      </Heading>

      <Text fontSize="lg" textAlign={"center"}>
        DarchLabs offers several networks and to run jobs.
      </Text>

      <Text fontSize="md" textAlign={"center"}>
        With us you can implement jobs that will allow you to perform transaction automatically in your smart contract.
        It will be based on a cronjob and on the smart contract logic.
      </Text>

      <Link to={createLink}>
        <Button mt={7} size={"md"} colorScheme={"pink"} bgColor={"pink.400"}>
          CREATE JOB
        </Button>
      </Link>
    </VStack>
  );
}
