import { type LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/synchronizers/create/network");
};

export const FormTitle = "Create Synchronizer";
export const FormName = "createSynchronizerForm";
export type Step = "Network" | "Configure" | "Confirm";
export const Steps: Step[] = ["Network", "Configure", "Confirm"];
