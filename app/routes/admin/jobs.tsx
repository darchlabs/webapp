import { HStack } from "@chakra-ui/react";
import HeaderDashboard from "../../components/header/dashboard";
import JobsTable from "../../components/jobs-table/table";

import { Form, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { job } from "../../pkg/jobs/jobs.server";
import type {
  ListJobsResponse,
  ListProvidersResponse,
} from "~/pkg/jobs/requests";
import { useState } from "react";
import { requireUserId } from "~/session.server";

type loaderData = {
  jobs: ListJobsResponse;
  providers: ListProvidersResponse;
};

export const loader: LoaderFunction = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const data = await job.ListJobs();
  const providers = await job.ListProviders();

  return json({ jobs: data, providers: providers });
};

export const action = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const body = await request.formData();

  const id = `${body.get("jobId")}`;
  console.log("id: ", id);
  const action = body.get("updateStatus");
  console.log("aciton : ", action);

  if (action === "delete") {
    const res = await job.DeleteJob(id);
    console.log("res: ", res);
  }

  if (action === "start") {
    const res = await job.StartJob(id);
    console.log("res: ", res);
  }

  if (action === "stop") {
    const res = await job.StopJob(id);
    console.log("res: ", res);
  }

  return null;
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in jobs error section</>;
}

export default function App() {
  const { jobs, providers } = useLoaderData<loaderData>();

  let [id, setId] = useState("");
  function handlerJobId(id: string) {
    setId(id);
  }

  return (
    <>
      <HeaderDashboard title={"Jobs"} linkTo={`/jobs/create/provider`} />
      <Outlet />

      <Form method="post">
        <JobsTable
          items={jobs.data}
          providers={providers.data}
          jobId={id}
          handlerJobId={handlerJobId}
        />
      </Form>

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}></HStack>
    </>
  );
}
