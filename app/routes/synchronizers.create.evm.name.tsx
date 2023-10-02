import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateSynchronizersEvmNameAction, type NameActionData } from "./synchronizers.create.evm.name.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { synchronizers } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersEvmNameAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEvmName() {
  const loaderData = useLoaderData() as LoaderData;
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
      <>
        <TextInput
          title={"Contract Name"}
          name={"name"}
          value={loaderData?.contract?.name}
          form={FormName}
          error={actionData?.name.error}
          placeholder={"Name"}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Enter the name of the contract"
          description="The name of smartcontract that will serve as a reference for identification purposes"
          hint={
            "Hint: Make sure to enter a address that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </>
    </Create>
  );
}
