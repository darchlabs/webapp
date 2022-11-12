import { HStack, VStack } from "@chakra-ui/react";
import Sidebar from "../../components/sidebar";
import SynchronizerTable from "../../components/synchronizer-table/table";
import HeaderDashboard from "../../components/header/dashboard";
// import CreateSynchronizer from "../../components/create-synchronizer";

import type { ListEventsResponse } from "../../pkg/synchronizer/requests";
import { redis } from "~/pkg/redis/redis.server";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { synchronizer } from "../../pkg/synchronizer/synchronizer.server";

export const loader: LoaderFunction = async () => {
  const data = await synchronizer.ListEvents();
  return json(data as ListEventsResponse);
};

export default function App() {
  const items = useLoaderData<ListEventsResponse>();

  return (
    <HStack alignItems={"start"} spacing={"0px"}>
      <Sidebar />
      <VStack as={"section"} bg={"#F7F8FC"} minW={0} w={"full"} h={"calc(100vh)"} pl={"30px"} pr={"30px"}>
        <HeaderDashboard />
        <Outlet />

        <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
          <SynchronizerTable items={items.data} cronjob={items.meta.cronjob} />
        </HStack>
      </VStack>
    </HStack>
  );
}
