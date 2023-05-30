import { Box, VStack, Text } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Create, TemplateTitleDescriptionHint } from "@components/create";
import { CreateSynchronizersEvmConfirmAction, type ConfirmActionData } from "./synchronizers.create.evm.confirm.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type SmartContractInput } from "darchlabs";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { ShortAddress } from "@utils/short-address";
import { CreateSynchronizersEvmConfirmLoader } from "./synchronizers.create.evm.confirm.loader";

export const action: ActionFunction = CreateSynchronizersEvmConfirmAction;
export const loader: LoaderFunction = CreateSynchronizersEvmConfirmLoader;

export default function CreateSynchronizerEvmConfirm() {
  const {
    smartcontract: { name, network, address, abi },
  } = useLoaderData() as LoaderData<SmartContractInput>;
  const actionData = useActionData() as ConfirmActionData;

  // get event and function counters
  const events = abi.reduce((sum, { type }: { type: string }) => (type === "event" ? sum + 1 : sum), 0);
  const functions = abi.reduce((sum, { type }: { type: string }) => (type === "function" ? sum + 1 : sum), 0);

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Confirm"
      baseTo="synchronizers"
      backTo="/synchronizers/create/evm/abi"
    >
      <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
        <Text color={"blackAlpha.800"} fontSize={"lg"} fontWeight={"semibold"}>
          Synchronizer info
        </Text>

        <VStack spacing={1} alignItems={"start"} color={"gray.500"}>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Name:
            </Text>{" "}
            {name}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Network:
            </Text>{" "}
            {network}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Address:{" "}
            </Text>
            {ShortAddress(address)}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              ABI:{" "}
            </Text>{" "}
            {events} events and {functions} functions
          </Text>
        </VStack>

        {actionData?.confirm?.error ? <Text color={"red.500"}>{actionData?.confirm?.error}</Text> : null}
      </VStack>
      <Box flex={0.6}>
        <TemplateTitleDescriptionHint
          title="Confirm information before to create synchronizer"
          description="Remember that you cannot modify information about the synchronizer once it's created, so if you need to make changes, you will have to delete it first and then create a new one"
        />
      </Box>
    </Create>
  );
}
