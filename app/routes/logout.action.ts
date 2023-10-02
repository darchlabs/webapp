import { redirect, type ActionFunction } from "@remix-run/node";
import { getSession, destroySession } from "@models/backoffice/backoffice-cookie.server";
import { Darchlabs } from "@models/darchlabs/darchlabs.server";

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  // remove token in darchlabs client
  Darchlabs.updateApiKey("token")

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
