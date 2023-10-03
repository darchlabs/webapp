import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateJobNameAction, type NameActionData } from "./jobs.create.name.action";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { useLoaderData, useActionData } from "@remix-run/react";

export const action: ActionFunction = CreateJobNameAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobName() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as NameActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      backTo="/jobs/create/network"
      nextTo="address"
    >
      <>
        <TextInput
          title={"Job Name"}
          name={"name"}
          value={loaderData?.job?.name}
          form={FormName}
          error={actionData?.name.error}
          placeholder={"Name"}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Enter the name of the job"
          description="The name of job that will serve as a reference for identification purposes"
          hint={
            "Hint: Make sure to enter a address that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </>
    </Create>
  );
}
