import { BaseError } from "@errors/base";
import { type LoaderFunction, redirect } from "@remix-run/node";

export const ErrorBoundary = BaseError;
export const loader: LoaderFunction = async () => {
  return redirect("/jobs/create/network");
};

export const FormTitle = "Create Job";
export const FormName = "createJobForm";
export type Step = "Configure" | "Confirm";
export const Steps: Step[] = ["Configure", "Confirm"];
