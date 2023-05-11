import { Text } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { Create, TemplateTitleDescriptionHint, NetworkSelectInput } from "@components/create";
import { CreateSynchronizersNetworkAction, type NetworkActionData } from "./synchronizers.create.network.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { type SmartContractInput } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersNetworkAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerNetwork() {
  const loaderData = useLoaderData() as LoaderData<SmartContractInput>;
  const actionData = useActionData() as NetworkActionData;

  return (
    <Create title={FormTitle} form={FormName} steps={Steps} currentStep="Network" baseTo="synchronizers" nextTo="name">
      <>
        <NetworkSelectInput
          value={loaderData?.smartcontract?.network}
          form={FormName}
          error={actionData?.network?.error}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Select the network"
          description="The contract must already be implemented in the chosen network"
          hint={
            <>
              Hint: For now we are only accepting contract on Ethereum and Polygon. Check the{" "}
              <Text as={"span"} color={"pink.400"} fontWeight={"medium"}>
                Roadmap
              </Text>{" "}
              to know the next networks
            </>
          }
        />
      </>
    </Create>
  );
}
