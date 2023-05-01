import type { LoaderFunction, LoaderArgs } from "@remix-run/node";

export type Cookie<T> = {
  data: T;
  cookie: string;
};

export function withCookie<T>(name: string, getSession: any, commitSession: any, fn: LoaderFunction): LoaderFunction {
  return async (args: LoaderArgs) => {
    console.log("111");
    // get cookie
    const session = await getSession(args.request.headers.get("Cookie"));
    const data: T = session.get(name) ? session.get(name) : ({} as T);

    // save synchonizer cookie
    session.set(name, data);
    const cookie = await commitSession(session);

    // save cookie inside of context
    args.context[name] = { data: data, cookie } as Cookie<T>;

    return fn(args);
  };
}
