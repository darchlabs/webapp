import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateJobAddressAction, type AddressActionData } from "./jobs.create.address.action";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { useLoaderData, useActionData } from "@remix-run/react";

export const action: ActionFunction = CreateJobAddressAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobAddress() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as AddressActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      backTo="/jobs/create/node"
      nextTo="abi"
    >
      <>
        <TextInput
          title={"Contract Address"}
          name={"address"}
          value={loaderData?.job?.address}
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
