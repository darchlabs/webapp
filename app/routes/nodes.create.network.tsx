import { Text } from "@chakra-ui/react";
import { type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { Create, TemplateTitleDescriptionHint, NetworkSelectInput } from "@components/create";
import { CreateNodeNetworkAction, type NetworkActionData } from "./nodes.create.network.action";
import { FormName, FormTitle, Steps } from "./nodes.create._index";
import { CreateNodeLoader, type LoaderData } from "./nodes.create.loader";
import { type Network, NetworksEnvironments } from "darchlabs";

export const action: ActionFunction = CreateNodeNetworkAction;
export const loader: LoaderFunction = CreateNodeLoader;

export default function CreateNodeNetwork() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as NetworkActionData;

  const networks = Object.keys(NetworksEnvironments) as Network[];

  return (
    <Create title={FormTitle} form={FormName} steps={Steps} currentStep="Network" baseTo="nodes">
      <>
        <NetworkSelectInput
          value={loaderData?.network}
          form={FormName}
          error={actionData?.network?.error}
          networks={networks}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Select the network"
          description="The nodes are dedicated, so you will be charged for the total computing resources/memory required by the node"
          hint={
            <>
              Hint: For now we are only working with Chainlink and Celo nodes. Check the{" "}
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
