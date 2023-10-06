import { HStack } from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { Table } from "@components/table";
import { TableItem } from "@components/synchronizers/events";
import { BaseLayout } from "@components/layouts";
import type { LoaderFunction } from "@remix-run/node";
import { EventsLoader, type EventsLoaderData } from "./events.$address.loader";
import { BaseError } from "@errors/base";

export const ErrorBoundary = BaseError;
export const loader: LoaderFunction = EventsLoader;

export default function App() {
  const {
    events,
    eventsCounts,
    address,
    auth,
    pagination,
  } = useLoaderData<EventsLoaderData>();

  return (
    <BaseLayout title="Events" subtitle={address} linkFrom={"/synchronizers"} auth={auth}>
      <HStack justifyContent={"center"} w={"full"}>
        <Table
          title="events"
          columns={["event details", "event count", "status", "last updated", ""]}
          emptyMsg={"You do not have any registered event."}
          pagination={pagination}
        >
          {events.map((event, index) => (
            <TableItem key={index} item={event} count={eventsCounts[event?.abi?.name]} />
          ))}
        </Table>
      </HStack>
    </BaseLayout>
  );
}
