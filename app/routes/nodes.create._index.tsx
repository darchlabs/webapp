import { type LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/nodes/create/network");
};

export const FormTitle = "Create Node";
export const FormName = "createNodeForm";
export const Steps = ["Network", "Configure", "Confirm"] as const;
export type Step = typeof Steps[number];
