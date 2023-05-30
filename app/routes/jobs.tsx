import { HStack } from "@chakra-ui/react";
import { Outlet, useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { JobsLoader } from "./jobs.loader";
import { type LoaderData } from "./jobs.loader";
import { BaseLayout } from "@components/layouts";
import { Table } from "@components/table";
import { EmptyTable } from "@components/jobs/empty-table";
import { useLocation } from "@remix-run/react";
import { TableItem } from "@components/jobs/table-item";
import { type Job } from "@models/jobs/types";
import { ToMap } from "@utils/to-map";

export const loader = JobsLoader;

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.log(`App Error(isRouteErrorResponse)=${error}`);
  } else {
    console.log(`App Error=${error}`);
  }

  return <>here in jobs error section</>;
}

export default function App() {
  // define hooks
  const { jobs, providers } = useLoaderData() as LoaderData;
  const { pathname } = useLocation();

  const providerMap = ToMap(providers);
  const linkTo = "/jobs/create";
  const tableOptions = pathname.includes("/create") ? {} : { emptyTable: <EmptyTable createLink={linkTo} /> };

  return (
    <BaseLayout title="Jobs" linkTo={linkTo}>
      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Table
          title="jobs"
          columns={["Jobs Details", "Provider", "Event", "Methods", "Status", ""]}
          emptyMsg={"You do not have any registered jobs."}
          {...tableOptions}
        >
          {jobs.map((item, index) => (
            <TableItem key={index} item={item as Job} providerName={providerMap[item.providerId].name} />
          ))}
        </Table>
      </HStack>
    </BaseLayout>
  );
}
