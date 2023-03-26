import { HStack } from "@chakra-ui/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import HeaderDashboard from "../../components/header/dashboard";
import { Table } from "../../components/table";
import type { ListEventsResponse } from "../../pkg/synchronizer/requests";
import { synchronizer } from "../../pkg/synchronizer/synchronizer.server";
import { EmptyTable, TableItem, SubHeader } from "../../components/synchronizers";

type SynchronizersLoaderData = {
  events: ListEventsResponse;
  username: string;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const events = (await synchronizer.ListEvents()) as ListEventsResponse;

  // get sort query param
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") || "desc";

  // sort events
  if (sort === "asc") {
    events.data.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  } else if (sort === "desc") {
    events.data.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Get username
  const username = process.env["USER_NAME"] ? process.env["USER_NAME"] : "John Doe";

  return json<SynchronizersLoaderData>({ events, username });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in error section</>;
}

export default function App() {
  const {
    events: {
      data,
      meta: { cronjob },
    },
    username,
  } = useLoaderData<SynchronizersLoaderData>();

  return (
    <>
      <HeaderDashboard username={username} title={"Synchronizers"} linkTo={"/synchronizers/create/network"} />

      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Table
          title="synchronizers"
          columns={["event details", "network", "status", "last updated", ""]}
          subHeader={<SubHeader cronjob={cronjob} />}
          emptyTable={<EmptyTable createLink={"/admin/synchronizers/create/network"} />}
        >
          {data.map((item, index) => (
            <TableItem key={index} item={item} />
          ))}
        </Table>
      </HStack>
    </>
  );
}
