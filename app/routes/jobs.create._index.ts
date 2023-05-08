import { type LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/jobs/create/provider");
};

export const FormTitle = "Create Job";
export const FormName = "createJobForm";
export type Step = "Provider" | "Configure" | "Confirm";
export const Steps: Step[] = ["Provider", "Configure", "Confirm"];
