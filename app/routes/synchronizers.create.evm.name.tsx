import { Box, VStack } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateSynchronizersEvmNameAction, type NameActionData } from "./synchronizers.create.evm.name.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { type SmartContractInput } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersEvmNameAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEvmName() {
  const loaderData = useLoaderData() as LoaderData<SmartContractInput>;
  const actionData = useActionData() as NameActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="synchronizers"
      backTo="/synchronizers/create"
      nextTo="node"
    >
      <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
        <TextInput
          title={"Contract Name"}
          name={"name"}
          value={loaderData?.smartcontract?.name}
          form={FormName}
          error={actionData?.name.error}
          placeholder={"Name"}
        />
      </VStack>
      <Box flex={0.6}>
        <TemplateTitleDescriptionHint
          title="Second, enter the name of the contract"
          description="The name of smartcontract that will serve as a reference for identification purposes"
          hint={
            "Hint: Make sure to enter a address that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </Box>
    </Create>
  );
}
