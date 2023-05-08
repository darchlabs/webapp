import { Box, VStack } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateSynchronizersEvmAddressAction, type AddressActionData } from "./synchronizers.create.evm.address.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { type SmartContractInput } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersEvmAddressAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEVMAddress() {
  const loaderData = useLoaderData() as LoaderData<SmartContractInput>;
  const actionData = useActionData() as AddressActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="synchronizers"
      backTo="/synchronizers/create/evm/node"
      nextTo="abi"
    >
      <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
        <TextInput
          title={"Contract Address"}
          name={"address"}
          value={loaderData?.smartcontract?.address}
          form={FormName}
          error={actionData?.address.error}
          placeholder={"0x123456789..."}
        />
      </VStack>
      <Box flex={0.6}>
        <TemplateTitleDescriptionHint
          title="Fourthly, insert the address of the contract"
          description="Remember to verify that the contract has been deployed on the provider that was specified earlier"
          hint={
            "Hint: Make sure to enter a address that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </Box>
    </Create>
  );
}