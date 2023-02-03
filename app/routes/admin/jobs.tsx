import { HStack } from "@chakra-ui/react";
import HeaderDashboard from "../../components/header/dashboard";
import JobsTable from "../../components/jobs-table/table";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { job } from "../../pkg/jobs/jobs.server";
import type {
  ListJobsResponse,
  ListProvidersResponse,
} from "~/pkg/jobs/requests";

type loaderData = {
  jobs: ListJobsResponse;
  providers: ListProvidersResponse;
};

export const loader: LoaderFunction = async () => {
  const data = await job.ListJobs();
  const providers = await job.ListProviders();

  return json({ jobs: data, providers: providers });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in jobs error section</>;
}

export default function App() {
  const { jobs, providers } = useLoaderData<loaderData>();

  return (
    <>
      <HeaderDashboard title={"Jobs"} linkTo={`/jobs/create/provider`} />
      <Outlet />
      <JobsTable items={jobs.data} providers={providers.data} />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}></HStack>
    </>
  );
}
