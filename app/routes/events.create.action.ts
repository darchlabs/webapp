import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  console.log("Action: Synchronizers create");
  return;
};
