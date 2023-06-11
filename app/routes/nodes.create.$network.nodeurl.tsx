import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Text } from "@chakra-ui/react";
import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateNodeUrlAction, type NodeUrlActionData } from "./nodes.create.$network.nodeurl.action";
import { CreateNodeLoader, type LoaderData } from "./nodes.create.$network.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { FormTitle, FormName, Steps } from "./nodes.create._index";
import { type NodesChainlinkNE } from "darchlabs";

export const action: ActionFunction = CreateNodeUrlAction;
export const loader: LoaderFunction = CreateNodeLoader;

export default function CreateJobNode() {
  const loaderData = useLoaderData() as LoaderData<NodesChainlinkNE>;
  const actionData = useActionData() as NodeUrlActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="nodes"
      backTo="/nodes/create/network"
    >
      <>
        <TextInput
          title={"Node URL"}
          name={"nodeUrl"}
          value={loaderData?.input?.envVars?.ETH_URL}
          form={FormName}
          error={actionData?.nodeUrl.error}
          placeholder={"Insert the node url"}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Enter the node URL"
          description={
            <Text>
              Please ensure that the URL is in the{" "}
              <Text color={"pink.400"} fontWeight={"semibold"} as={"span"}>
                wss
              </Text>{" "}
              format, which refers to the WebSocket protocol route associated with a node"
            </Text>
          }
          hint={
            "Hint: Make sure to enter a URL that is compatible with either the Ethereum or Polygon network, depending on the network you selected earlier"
          }
        />
      </>
    </Create>
  );
}
