import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ListEventsResponse, Pagination } from "darchlabs";
import { Synchronizers } from "@models/synchronizers/synchronizers.server";
import { redirect } from "react-router-dom";
import { withPagination } from "@middlewares/with-pagination";

export type EventsLoaderData = {
  events: ListEventsResponse;
  address: string;
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

  return json<EventsLoaderData>({ events, address });
});
