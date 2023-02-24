import { createCookieSessionStorage } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { infra } from "./pkg/infra/infra.server";
import type { User } from "./pkg/infra/types";

const USER_SESSION_KEY = "userId";

export const MockUser = {
  id: "1",
  email: "admin@drachlabs.com",
  name: "John",
  password: "Doe",
  verified: true,
};

export async function createUserSession({
  request,
  userId,
}: {
  request: Request;
  userId: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days,
      }),
    },
  });
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [`${process.env.SESSION_SECRET}`],
    secure: process.env.NODE_ENV === "production",
  },
});

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);

  return userId;
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  // get user from api
  // const response = { Data: MockUser } as GetUserResponse;
  const response = await infra.GetUser(userId);

  // return user if exists
  if (response.Data) return response.Data;

  // logout if user is not found
  throw await logout(request);
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}
