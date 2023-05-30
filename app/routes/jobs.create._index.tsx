import { type LoaderFunction, redirect } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  return redirect("/jobs/create/provider");
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.log(`App Error(isRouteErrorResponse)=${error}`);
  } else {
    console.log(`App Error=${error}`);
  }

  return <>here in jobs error section</>;
}
export const FormTitle = "Create Job";
export const FormName = "createJobForm";
export type Step = "Provider" | "Configure" | "Confirm";
export const Steps: Step[] = ["Provider", "Configure", "Confirm"];
