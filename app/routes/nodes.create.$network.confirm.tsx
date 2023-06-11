import { VStack, Text } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Create, TemplateTitleDescriptionHint } from "@components/create";
import { CreateNodeConfirmAction, type ConfirmActionData } from "./nodes.create.$network.confirm.action";
import { FormName, FormTitle, Steps } from "./nodes.create._index";
import { CreateNodeConfirmLoader } from "./nodes.create.$network.confirm.loader";
import { type NodesNetworkEnvironment, type NodeInput, type NodesCeloNE, NetworkInfo, type Info } from "darchlabs";
import { type LoaderData } from "./nodes.create.$network.loader";
import { useActionData, useLoaderData } from "@remix-run/react";

export const action: ActionFunction = CreateNodeConfirmAction;
export const loader: LoaderFunction = CreateNodeConfirmLoader;

function GetCeloNodeConfirmInfo({ node, info }: { node: NodeInput<NodesNetworkEnvironment>; info: Info }): JSX.Element {
  return (
    <VStack spacing={1} alignItems={"start"} color={"gray.500"}>
      <Text>
        <Text as={"span"} fontWeight={"bold"}>
          Network:
        </Text>{" "}
        {info.name}{" "}
        {!info.mainnet ? (
          <Text as="span" textTransform={"capitalize"}>
            (Testnet)
          </Text>
        ) : null}
      </Text>
      <Text>
        <Text as={"span"} fontWeight={"bold"}>
          Password:
        </Text>{" "}
        <Text as={"span"} textTransform={"capitalize"}>
          {node?.envVars?.PASSWORD}
        </Text>
      </Text>
    </VStack>
  );
}

export default function CreateJobConfirm() {
  const loaderData = useLoaderData() as LoaderData<NodesCeloNE>;
  const actionData = useActionData() as ConfirmActionData;
  const info = NetworkInfo[loaderData.network];

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Confirm"
      baseTo="nodes"
      backTo={`/nodes/create/${loaderData.network}/password`}
    >
      <VStack w={"full"} alignItems={"start"} pr={"10%"}>
        <Text color={"blackAlpha.800"} fontSize={"lg"} fontWeight={"semibold"}>
          Node info
        </Text>

        <GetCeloNodeConfirmInfo node={loaderData.input} info={info} />

        {actionData?.confirm?.error ? (
          <Text color={"red.500"} textTransform={"capitalize"}>
            {actionData?.confirm?.error}
          </Text>
        ) : null}
      </VStack>

      <>
        <TemplateTitleDescriptionHint
          title="Confirmation before creating the node"
          description={
            <VStack spacing={5}>
              <Text>
                1. Provisioning Time: The process may take a few minutes to complete and fully update the node.
              </Text>
              <Text>
                2. Resource Costs: The required resources for the dedicated node will be directly covered by the client.
              </Text>
              <Text>
                3. Flexibility of Removal: The node can be removed at any time according to the user's preference.
              </Text>
            </VStack>
          }
        />
      </>
    </Create>
  );
}
