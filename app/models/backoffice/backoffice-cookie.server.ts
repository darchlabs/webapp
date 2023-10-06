import invariant from "tiny-invariant";
import { createCookieSessionStorage } from "@remix-run/node";

const { COOKIE_SECRET } = process.env;
invariant(typeof COOKIE_SECRET === "string", "COOKIE_SECRET env var not set");

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "backofficeSession",
    secrets: [COOKIE_SECRET!]
  },
});