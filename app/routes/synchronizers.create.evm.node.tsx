import { Box, VStack } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateSynchronizersEvmNodeAction, type NodeActionData } from "./synchronizers.create.evm.node.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { type SmartContractInput } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersEvmNodeAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEVMNode() {
  const loaderData = useLoaderData() as LoaderData<SmartContractInput>;
  const actionData = useActionData() as NodeActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="synchronizers"
      backTo="/synchronizers/create/evm/name"
      nextTo="address"
    >
      <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
        <TextInput
          title={"Node URL"}
          name={"nodeUrl"}
          value={loaderData?.smartcontract?.nodeURL}
          form={FormName}
          error={actionData?.nodeUrl.error}
          placeholder={"Insert the node url"}
        />
      </VStack>
      <Box flex={0.6}>
        <TemplateTitleDescriptionHint
          title="Third, enter the node URL"
          description="The URL must be valid and point to a node on the selected network"
          hint={
            "Hint: Make sure to enter a URL that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </Box>
    </Create>
  );
}
