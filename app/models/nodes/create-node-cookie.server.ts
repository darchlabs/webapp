import { createFileSessionStorage, createCookie } from "@remix-run/node";

const sessionCookie = createCookie("nodeSession", {});

export const { getSession, commitSession, destroySession } = createFileSessionStorage({
  dir: "./sessions",
  cookie: sessionCookie,
});
