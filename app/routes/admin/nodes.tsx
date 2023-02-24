import { HStack } from "@chakra-ui/react";
import NodeTable from "../../components/node-table/table";
import HeaderDashboard from "../../components/header/dashboard";

import { Form, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { node } from "../../pkg/node/node.server";
import { useState } from "react";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const response = await node.GetStatus();
  return json({ response, nodesURL: node.getURL() });
};

export function ErrorBoundary({ error }: { error: Error }) {
  return <>Oops, there is an error in nodes section</>;
}

export const action = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const body = await request.formData();
  const id = `${body.get("nodeId")}`;
  const action = body.get("updateStatus");

  if (action === "delete") {
    const res = await node.DeleteNode(id);
    console.log("res: ", res);
  }

  return null;
};

export default function App() {
  const { response, nodesURL } = useLoaderData<typeof loader>();

  let [id, setId] = useState("");
  function handlerNodeId(id: string) {
    setId(id);
  }

  return (
    <>
      <HeaderDashboard title={"Nodes"} linkTo={"/nodes/create/network"} />

      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Form method="post">
          <NodeTable
            nodeList={response.nodes}
            nodesURL={nodesURL}
            nodeId={id}
            handlerNodeId={handlerNodeId}
          />
        </Form>
      </HStack>
    </>
  );
}
