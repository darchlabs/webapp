import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateJobsNodeAction, type NodeActionData } from "./jobs.create.node.action";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { FormTitle, FormName, Steps } from "./jobs.create._index";

export const action: ActionFunction = CreateJobsNodeAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobNode() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as NodeActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      backTo="/jobs/create/name"
      nextTo="address"
    >
      <>
        <TextInput
          title={"Node URL"}
          name={"nodeUrl"}
          value={loaderData?.job?.nodeUrl}
          form={FormName}
          error={actionData?.nodeUrl.error}
          placeholder={"Insert the node url"}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Enter the node URL"
          description="The URL must be valid and point to a node on the selected network"
          hint={
            "Hint: Make sure to enter a URL that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </>
    </Create>
  );
}
