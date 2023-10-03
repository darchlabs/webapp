import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateSynchronizersEvmAddressAction, type AddressActionData } from "./synchronizers.create.evm.address.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { synchronizers } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersEvmAddressAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEVMAddress() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as AddressActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="synchronizers"
      backTo="/synchronizers/create/evm/name"
      nextTo="webhook"
    >
      <>
        <TextInput
          title={"Contract Address"}
          name={"address"}
          value={loaderData?.contract?.address}
          form={FormName}
          error={actionData?.address.error}
          placeholder={"0x123456789..."}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Insert the address of the contract"
          description="Remember to verify that the contract has been deployed on the provider that was specified earlier"
          hint={
            "Hint: Make sure to enter a address that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </>
    </Create>
  );
}
