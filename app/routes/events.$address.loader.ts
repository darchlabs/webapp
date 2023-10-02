import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { pagination, synchronizers } from "darchlabs";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";
import { redirect } from "react-router-dom";
import { withPagination } from "@middlewares/with-pagination";
import { AuthData, withAuth } from "@middlewares/with-auth";

export type EventsCounts = { [eventName: string]: number };

export type EventsLoaderData = {
  events: synchronizers.Event[];
  address: string;
  eventsCounts: EventsCounts;
  auth: AuthData;
};

export const EventsLoader: LoaderFunction = withAuth(withPagination(async ({ params, context }: LoaderArgs) => {
  // get address path param
  const { address } = params;
  if (!address || address === "") {
    return redirect("/synchronizers");
  }

  // get pagination context for middleware
  const pagination = context.pagination as pagination.Pagination | {};

  // get events
  const { events } = await Darchlabs.synchronizers.events.listEventsByAddress(address!, pagination);
  if (!events.length) {
    return redirect("/synchronizers");
  }

  const eventsCounts: { [eventName: string]: number } = {};
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const eventName = event?.abi?.name;
    const { pagination } = await Darchlabs.synchronizers.events.listEventData(address, eventName, {
      page: 0,
      limit: 1,
    });

    eventsCounts[eventName] = pagination?.totalElements;
  }

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json<EventsLoaderData>({ events, eventsCounts, address, auth });
}));
