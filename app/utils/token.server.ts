import { AuthData } from "@middlewares/with-auth";
import { getSession, destroySession } from "@models/backoffice/backoffice-cookie.server";
import { redirect } from "@remix-run/node";

export const GetToken = async (request: Request): Promise<string> => {
  const session = await getSession(request.headers.get("Cookie"));
  const data: AuthData = session.get("backofficeSession");
  const token = data?.token || "";

  return token
}

export const DeleteToken = async (request: Request): Promise<void> => {
  const session = await getSession(request.headers.get("Cookie"));

  throw redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
