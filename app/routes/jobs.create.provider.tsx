import { Text } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { Create, TemplateTitleDescriptionHint, ProviderSelectInput } from "@components/create";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { CreateJobProviderAction, type ProviderActionData } from "./jobs.create.provider.action";

export const action: ActionFunction = CreateJobProviderAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobProvider() {
  const { providers, job } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ProviderActionData;

  console.log(providers, actionData, job);

  return (
    <Create title={FormTitle} form={FormName} steps={Steps} currentStep="Provider" baseTo="jobs" nextTo="network">
      <>
        <ProviderSelectInput
          value={job?.providerId}
          form={FormName}
          providers={providers}
          error={actionData?.providerId?.error}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Select the jobs provider"
          description="The contract must already be deployed on the provider's choosen network"
          hint={
            <>
              Hint: Check our roadmap to know the next networks we will support for providers{" "}
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
