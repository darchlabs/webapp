import { useMatches } from "@remix-run/react";
import type { User } from "~/pkg/infra/types";

type rootLoader = {
  user: User;
};

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

// get loader data from router
export function useOptionalUser(): User | undefined {
  //   const data = useMatchesData("root");
  const data = useParentData("root") as rootLoader;
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

// Created function for getting data from only one loader matching path
function useParentData(pathname: string): unknown {
  let matches = useMatches();
  let parentMatch = matches.find((match) => match.pathname === pathname);
  if (!parentMatch) return null;
  return parentMatch.data;
}
