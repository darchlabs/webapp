import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { pagination, synchronizers } from "darchlabs";
import { redirect } from "react-router-dom";
import { withPagination } from "@middlewares/with-pagination";
import { AuthData, withAuth } from "@middlewares/with-auth";
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

export type EventsCounts = { [eventName: string]: number };

export type EventsLoaderData = {
  events: synchronizers.Event[];
  address: string;
  eventsCounts: EventsCounts;
  auth: AuthData;
  pagination: pagination.Pagination;
};

export const EventsLoader: LoaderFunction = withAuth(withPagination(async ({ params, context, request }: LoaderArgs) => {
  // get address path param
  const { address } = params;
  if (!address || address === "") {
    return redirect("/synchronizers");
  }

  // get pagination context for middleware
  const pagination = context.pagination as pagination.Pagination || {};

  // get events from darchlabs
  let events: synchronizers.Event[];
  let eventsCounts: EventsCounts = {};
  try {
    // get darchlabs client
    const client = await GetDarchlabsClient(request);

    // get events
    ({ events } = await client.synchronizers.events.listEventsByAddress(address!, pagination));
    if (!events.length) {
      return redirect("/synchronizers");
    }

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const eventName = event?.abi?.name;
      const { pagination: p } = await client.synchronizers.events.listEventData(address, eventName, {
        page: 0,
        limit: 1,
      });

      eventsCounts[eventName] = p?.totalElements;
    }
  } catch (err) {
    throw err;
  }

  // get auth context from middleware
  const auth = context.auth as AuthData;

  return json<EventsLoaderData>({ events, eventsCounts, address, auth, pagination });
}));
