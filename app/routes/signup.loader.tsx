import { withAuth } from "@middlewares/with-auth";
import { json, redirect, type LoaderArgs, type LoaderFunction } from "@remix-run/node";

export const SignupLoader: LoaderFunction = withAuth(async ({context}: LoaderArgs) => {
  // check if user is well logged
  if (context.auth) {
    return redirect("/overview")
  }

  return json({});
})
