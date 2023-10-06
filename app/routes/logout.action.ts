import { redirect, type ActionFunction } from "@remix-run/node";
import { getSession, destroySession } from "@models/backoffice/backoffice-cookie.server";

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
