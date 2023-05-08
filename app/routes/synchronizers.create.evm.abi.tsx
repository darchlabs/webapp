import { Box, VStack } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Create, TemplateTitleDescriptionHint, TextArea } from "@components/create";
import { CreateSynchronizersEvmAbiAction, type AbiActionData } from "./synchronizers.create.evm.abi.action";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type SmartContractInput } from "darchlabs";
import { CreateSynchronizersEvmLoader, type LoaderData } from "./synchronizers.create.evm._index";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";

export const action: ActionFunction = CreateSynchronizersEvmAbiAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEvmAbi() {
  const loaderData = useLoaderData() as LoaderData<SmartContractInput>;
  const actionData = useActionData() as AbiActionData;

  // parse abi json object to string
  let abi = "";
  if (loaderData?.smartcontract?.abi) {
    abi = JSON.stringify(loaderData?.smartcontract?.abi);
  }

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="synchronizers"
      backTo="/synchronizers/create/evm/address"
      nextTo="confirm"
    >
      <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
        <TextArea
          title={"ABI"}
          name={"abi"}
          value={abi}
          form={FormName}
          error={actionData?.abi.error}
          placeholder={'[{"anonymous": boolean, "inputs": Input[], "name": string, "type": "event"}]'}
        />
      </VStack>
      <Box flex={0.6}>
        <TemplateTitleDescriptionHint
          title="Fifth, insert the event ABI of the contract"
          description="Remember that if your contract is not verified, you will have to enter the ABI manually"
          hint={
            "Hint: to verify the contract you can see the follow guide. Check our Roadmap to find out when we will implement contract verification in the admin panel"
          }
        />
      </Box>
    </Create>
  );
}