import { logout, requireUserId } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";

// Ifa user navigates to this route, he'll be logged out
export async function loader({ request }: LoaderArgs) {
  // Check that user is logged
  await requireUserId(request);

  // return logout if logged
  return logout(request);
}
