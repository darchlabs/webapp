import { HStack } from "@chakra-ui/react";
import NodeTable from "@components/node-table/table";
import { Header } from "@components/header";

import { Form, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Nodes } from "@models/nodes.server";
import { useState } from "react";

export const loader: LoaderFunction = async () => {
  const response = await Nodes.GetStatus();

  // Get username
  const username = process.env["USER_NAME"] ? process.env["USER_NAME"] : "John Doe";

  return json({ response, nodesURL: Nodes.getAppDNS(), username });
};

export function ErrorBoundary({ error }: { error: Error }) {
  return <>Oops, there is an error in nodes section</>;
}

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  const id = `${body.get("nodeId")}`;
  console.log("id: ", id);
  const action = body.get("updateStatus");
  console.log("aciton : ", action);

  if (action === "delete") {
    const res = await Nodes.DeleteNode(id);
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
      <Header title={"Nodes"} linkTo={"/nodes/create/network"} />

      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Form method="post">
          <NodeTable nodeList={response.nodes} nodesURL={nodesURL} nodeId={id} handlerNodeId={handlerNodeId} />
        </Form>
      </HStack>
    </>
  );
}
