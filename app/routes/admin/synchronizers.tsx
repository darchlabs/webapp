import { HStack } from "@chakra-ui/react";
import SynchronizerTable from "../../components/synchronizer-table/table";
import HeaderDashboard from "../../components/header/dashboard";

import type { ListEventsResponse } from "../../pkg/synchronizer/requests";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { synchronizer } from "../../pkg/synchronizer/synchronizer.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const data = await synchronizer.ListEvents();
  return json(data as ListEventsResponse);
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in error section</>;
}

export default function App() {
  const items = useLoaderData<ListEventsResponse>();

  return (
    <>
      <HeaderDashboard
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
