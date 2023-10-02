import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Create, TemplateTitleDescriptionHint, TextArea } from "@components/create";
import { CreateJobAbiAction, type AbiActionData } from "./jobs.create.abi.action";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./jobs.create.loader";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobAbiLoader } from "./jobs.create.abi.loader"

export const action: ActionFunction = CreateJobAbiAction;
export const loader: LoaderFunction = CreateJobAbiLoader;

export default function CreateJobAbi() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as AbiActionData;

  // parse abi json object to string
  let abi = "";
  if (loaderData?.job?.abi) {
    abi = JSON.stringify(loaderData?.job?.abi);
  }

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      backTo="/jobs/create/address"
      nextTo="methods"
    >
      <>
        <TextArea
          title={"ABI"}
          name={"abi"}
          value={loaderData.job.abi}
          form={FormName}
          error={actionData?.abi.error}
          placeholder={'[{"anonymous": boolean, "inputs": Input[], "name": string, "type": "event"}]'}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Insert the event ABI of the contract"
          description="Remember that if your contract is not verified, you will have to enter the ABI manually"
          hint={
            "Hint: to verify the contract you can see the follow guide. Check our Roadmap to find out when we will implement contract verification in the admin panel"
          }
        />
      </>
    </Create>
  );
}
