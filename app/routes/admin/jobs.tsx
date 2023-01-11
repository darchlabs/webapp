import { HStack } from "@chakra-ui/react";
import HeaderDashboard from "../../components/header/dashboard";
import JobsTable from "../../components/jobs-table/table";

import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { job } from "../../pkg/jobs/jobs.server";
<<<<<<< HEAD
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
=======
import type { ListJobsResponse } from "~/pkg/jobs/requests";

export const loader: LoaderFunction = async () => {
  const data = await job.ListJobs();
  return json(data as ListJobsResponse);
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <>here in jobs error section</>;
}

export default function App() {
<<<<<<< HEAD
  const { jobs, providers } = useLoaderData<loaderData>();

=======
  const { data } = useLoaderData() as ListJobsResponse;
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
  return (
    <>
      <HeaderDashboard title={"Jobs"} linkTo={`/jobs/create/provider`} />
      <Outlet />
<<<<<<< HEAD
      <JobsTable items={jobs.data} providers={providers.data} />
=======
      <JobsTable items={data} />
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}></HStack>
    </>
  );
}
