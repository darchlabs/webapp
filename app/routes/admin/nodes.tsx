import { HStack } from "@chakra-ui/react";
import NodeTable from "../../components/node-table/table";
import HeaderDashboard from "../../components/header/dashboard";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { node } from "../../pkg/node/node.server";

export const loader: LoaderFunction = async () => {
  const response = await node.GetStatus();
  return json(response);
};

export function ErrorBoundary({ error }: { error: Error }) {
  return <>Oops, there is an error in nodes section</>;
}

export default function App() {
  const response = useLoaderData<typeof loader>();

  return (
    <>
      <HeaderDashboard title={"Nodes"} linkTo={"/nodes/create/network"}/>
      
      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <NodeTable nodeList={response.nodes} />
      </HStack>
    </>
  );
}
