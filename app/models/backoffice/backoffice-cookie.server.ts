import invariant from "tiny-invariant";
import { createFileSessionStorage, createCookie } from "@remix-run/node";

const { COOKIE_SECRET} = process.env;
invariant(typeof COOKIE_SECRET === "string", "COOKIE_SECRET env var not set");

const backofficeSession = createCookie("backofficeSession", {
  secrets: [COOKIE_SECRET!]
});

export const { getSession, commitSession, destroySession } = createFileSessionStorage({
  dir: "./sessions",
  cookie: backofficeSession,
});