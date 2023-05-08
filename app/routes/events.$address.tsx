import { HStack } from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { Table } from "@components/table";
import { TableItem, SubHeader } from "@components/synchronizers/events";
import { BaseLayout } from "@components/layouts";
import type { LoaderFunction } from "@remix-run/node";
import { EventsLoader, type EventsLoaderData } from "./events.$address.loader";
import { BaseError } from "@errors/base";

export const ErrorBoundary = BaseError;
export const loader: LoaderFunction = EventsLoader;

export default function App() {
  const {
    events: {
      data,
      meta: { cronjob, pagination },
    },
    address,
  } = useLoaderData<EventsLoaderData>();

  return (
    <BaseLayout title="Events" subtitle={address} linkFrom={"/synchronizers"}>
      <HStack justifyContent={"center"} w={"full"}>
        <Table
          title="events"
          columns={["event details", "status", "last updated", ""]}
          subHeader={<SubHeader cronjob={cronjob} />}
          emptyMsg={"You do not have any registered event."}
          pagination={pagination}
        >
          {data.map((item, index) => (
            <TableItem key={index} item={item} />
          ))}
        </Table>
      </HStack>
    </BaseLayout>
  );
}
