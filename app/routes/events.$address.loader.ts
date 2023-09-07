import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ListEventsResponse, Pagination } from "darchlabs";
import { Synchronizers } from "@models/synchronizers/synchronizers.server";
import { redirect } from "react-router-dom";
import { withPagination } from "@middlewares/with-pagination";

export type EventsCounts = { [eventName: string]: number };

export type EventsLoaderData = {
  events: ListEventsResponse;
  address: string;
  eventsCounts: EventsCounts;
};

export const EventsLoader: LoaderFunction = withPagination(async ({ params, context }: LoaderArgs) => {
  // get address path param
  const { address } = params;
  if (!address || address === "") {
    return redirect("/synchronizers");
  }

  // get pagination context for middleware
  const pagination = context.pagination as Pagination | {};

  // get events
  const events = await Synchronizers.listEventsByAddress(address!, pagination);
  if (!events.data.length) {
    return redirect("/synchronizers");
  }

  const eventsCounts: { [eventName: string]: number } = {};
  for (let i = 0; i < events.data.length; i++) {
    const event = events.data[i];
    const eventName = event?.abi?.name;
    const eventDatas = await Synchronizers.listEventData(address, eventName, {
      page: 0,
      limit: 1,
    });

    eventsCounts[eventName] = eventDatas?.meta?.pagination?.totalElements;
  }

  return json<EventsLoaderData>({ events, eventsCounts, address });
});
