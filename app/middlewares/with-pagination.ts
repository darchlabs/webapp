import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { pagination } from "darchlabs";

export function withPagination(fn: LoaderFunction): LoaderFunction {
  return async (args: LoaderArgs) => {
    // get sort query param
    const url = new URL(args.request.url);
    let sort = url.searchParams.get("sort") as pagination.Sort;
    if (!sort) {
      sort = "desc";
    }

    // get limit query param
    let limit = Number(url.searchParams.get("limit"));
    if (!limit || Number.isNaN(limit)) {
      limit = 5;
    }

    // get page query param
    let page = Number(url.searchParams.get("page"));
    if (!page || Number.isNaN(page)) {
      page = 1;
    }

    // set pagination in context
    args.context.pagination = { sort, limit, page };

    return fn(args);
  };
}
