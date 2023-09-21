import { VStack, Text, Button } from "@chakra-ui/react";
import { Link, useLoaderData } from "@remix-run/react";
import { BaseLayout } from "@components/layouts";
import { OverviewLoader } from "./overview.loader";
import { StatusServices } from "@components/overview/status-services";
import { type LoaderData } from "./overview.loader";
import { ContractMetrics } from "@components/overview/contract-metrics";

export const loader = OverviewLoader;

export default function App() {
  const { smartcontracts, auth } = useLoaderData<LoaderData>();

  return (
    <BaseLayout title="Overview" auth={auth}>
      <VStack w={"full"} maxW={"1000px"} alignItems={"center"} spacing={10} pb={"24!"}>
        <StatusServices />

        {smartcontracts.length > 0 ? (
          smartcontracts.map((sc, index) => <ContractMetrics key={index} contract={sc} />)
        ) : (
          <VStack
            py={8}
            px={4}
            w={"full"}
            borderWidth={"3px"}
            borderStyle={"dashed"}
            borderColor={"blackAlpha.200"}
            bgColor={"white"}
            borderRadius={10}
            spacing={5}
          >
            <Text
              color={"blackAlpha.600"}
              fontSize={"lg"}
              lineHeight={"20px"}
              textAlign={"center"}
              fontWeight={"light"}
            >
              Add your first smart contract synchronizers to retrieve metrics
            </Text>
            <Link to={"/synchronizers/create"}>
              <Button size={"sm"} colorScheme={"pink"} bgColor={"pink.400"}>
                CREATE SYNCHRONIZER
              </Button>
            </Link>
          </VStack>
        )}
      </VStack>
    </BaseLayout>
  );
}
