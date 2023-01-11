import { HStack } from "@chakra-ui/react";
import HeaderDashboard from "../../components/header/dashboard";
import JobsTable from "../../components/jobs-table/table";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { job } from "../../pkg/jobs/jobs.server";
import type { ListJobsResponse } from "~/pkg/jobs/requests";

export const loader: LoaderFunction = async () => {
  const data = await job.ListJobs();
  return json(data as ListJobsResponse);
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in jobs error section</>;
}

export default function App() {
  const { data } = useLoaderData() as ListJobsResponse;
  return (
    <>
      <HeaderDashboard title={"Jobs"} linkTo={`/jobs/create/provider`} />
      <Outlet />
      <JobsTable items={data} />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}></HStack>
    </>
  );
}
