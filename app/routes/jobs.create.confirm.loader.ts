import { type Cookie, withCookie } from "@middlewares/with-cookie";
import { type LoaderArgs, type LoaderFunction, json, redirect } from "@remix-run/node";
import { network, jobs } from "darchlabs";
import { getSession, commitSession } from "@models/darchlabs/create-job-cookie.server";

export const CreateJobConfirmLoader: LoaderFunction = withCookie<jobs.JobInput>(
  "jobSession",
  getSession,
  commitSession,
  async ({ context }: LoaderArgs) => {
    // get session
    const jobSession = context["jobSession"] as Cookie<jobs.JobInput>;

    // define options to use in json or in redirect
    const opts = {
      headers: {
        "Set-Cookie": jobSession.cookie,
      },
    };

    // check if any attribute are empty in job session
    if (!jobSession.data.name || jobSession.data.name === "") {
      // redirect to name step
      return redirect("/jobs/create/name", opts);
    } else if (!jobSession.data.network || jobSession.data.network === ("" as network.Network)) {
      // redirect to network step
      return redirect("/jobs/create/network", opts);
    } else if (!jobSession.data.name || jobSession.data.name === "") {
      // redirect to name step
      return redirect("/jobs/create/name", opts);
    }
    // TODO(ca): remove validation because the node_url is setted in backend
    // else if (!jobSession.data.nodeUrl || jobSession.data.nodeUrl === "") {
    //   // redidect to node url step
    //   return redirect("/jobs/create/node", opts);
    // } 
    else if (!jobSession.data.address || jobSession.data.address == "") {
      // redirect to address step
      return redirect("/jobs/create/address", opts);
    } else if (!jobSession.data.abi) {
      // parse abi to json and evaluate
      const abi = JSON.parse(jobSession.data.abi);
      if (!Array.isArray(abi) || !abi.length) {
        // redirect to abi step
        return redirect("/jobs/create/abi", opts);
      }
    } else if (
      !jobSession.data.checkMethod ||
      !jobSession.data.checkMethod.length ||
      !jobSession.data.actionMethod ||
      !jobSession.data.actionMethod.length
    ) {
      // redirect to methods step
      return redirect("/jobs/create/methods", opts);
    } else if (!jobSession.data.cronjob || !jobSession.data.cronjob.length) {
      // redirect to cronjob step
      return redirect("/jobs/create/cronjob", opts);
    } else if (!jobSession.data.privateKey || !jobSession.data.privateKey.length) {
      // redirect to account step
      return redirect("/jobs/create/account", opts);
    }

    return json(
      {
        job: jobSession.data,
      },
      {
        headers: {
          "Set-Cookie": jobSession.cookie,
        },
      }
    );
  }
);
