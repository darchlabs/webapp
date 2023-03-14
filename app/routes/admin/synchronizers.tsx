import { HStack } from "@chakra-ui/react";
import SynchronizerTable from "../../components/synchronizer-table/table";
import HeaderDashboard from "../../components/header/dashboard";

import type { ListEventsResponse } from "../../pkg/synchronizer/requests";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { synchronizer } from "../../pkg/synchronizer/synchronizer.server";

type loaderData = {
  data: ListEventsResponse;
  username: string;
};

export const loader: LoaderFunction = async () => {
  const data = (await synchronizer.ListEvents()) as ListEventsResponse;

  // Get username
  const username = process.env["USER_NAME"]
    ? process.env["USER_NAME"]
    : "John Doe";

  return json<loaderData>({ data, username });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in error section</>;
}

export default function App() {
  const { data: items, username } = useLoaderData<loaderData>();

  return (
    <>
      <HeaderDashboard
        username={username}
        title={"Synchronizers"}
        linkTo={"/synchronizers/create/network"}
      />

      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <SynchronizerTable items={items.data} cronjob={items.meta.cronjob} />
      </HStack>
    </>
  );
}
