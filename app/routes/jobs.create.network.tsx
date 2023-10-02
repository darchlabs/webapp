import { Box, Text, VStack } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { Create, TemplateTitleDescriptionHint, NetworkSelectInput } from "@components/create";
import { CreateJobNetworkAction, type NetworkActionData } from "./jobs.create.network.action";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { FormTitle, FormName, Steps } from "./jobs.create._index";
import { JobNetwoks } from "darchlabs";

export const action: ActionFunction = CreateJobNetworkAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobNetwork() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as NetworkActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      nextTo="name"
      backTo="/jobs/create/provider"
    >
      <>
        <NetworkSelectInput value={loaderData?.job?.network} form={FormName} error={actionData?.network?.error} networks={JobNetwoks} />
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
