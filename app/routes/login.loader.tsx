import { withAuth } from "@middlewares/with-auth";
import { json, redirect, type LoaderArgs, type LoaderFunction } from "@remix-run/node";

export const LoginLoader: LoaderFunction = withAuth(async ({context, request}: LoaderArgs) => {
  // check if user is well logged
  if (context.auth) {
    return redirect("/overview")
  }

  return json({});
})
