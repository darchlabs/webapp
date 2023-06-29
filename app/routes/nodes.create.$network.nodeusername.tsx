import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateNodeEmailAction, type NodeEmailActionData } from "./nodes.create.$network.nodeusername.action";
import { CreateNodeLoader, type LoaderData } from "./nodes.create.$network.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { FormTitle, FormName, Steps } from "./nodes.create._index";
import { type NodesChainlinkNE } from "darchlabs";

export const action: ActionFunction = CreateNodeEmailAction;
export const loader: LoaderFunction = CreateNodeLoader;

export default function () {
  const loaderData = useLoaderData() as LoaderData<NodesChainlinkNE>;
  const actionData = useActionData() as NodeEmailActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="nodes"
      backTo={`/nodes/create/${loaderData?.network}/nodeurl`}
    >
      <>
        <TextInput
          title={"Email"}
          name={"email"}
          value={loaderData?.input?.envVars?.NODE_EMAIL}
          form={FormName}
          error={actionData?.email?.error}
          placeholder={"Insert the email"}
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
