import { HStack } from "@chakra-ui/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { JobsLoader } from "./jobs.loader";
import { type LoaderData } from "./jobs.loader";
import { BaseLayout } from "@components/layouts";
import { Table } from "@components/table";
import { EmptyTable } from "@components/jobs/empty-table";
import { useLocation } from "@remix-run/react";
import { TableItem } from "@components/jobs/table-item";
import { BaseError } from "@errors/base";

export const loader = JobsLoader;
export const ErrorBoundary = BaseError;

export default function App() {
  // define hooks
  const { jobs, auth } = useLoaderData() as LoaderData;
  const { pathname } = useLocation();

  const linkTo = "/jobs/create";
  const tableOptions = pathname.includes("/create") ? {} : { emptyTable: <EmptyTable createLink={linkTo} /> };

  return (
    <BaseLayout title="Jobs" linkTo={linkTo} auth={auth}>
      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Table
          title="jobs"
          columns={["Jobs Details", "Provider", "Event", "Methods", "Status", ""]}
          emptyMsg={"You do not have any registered jobs."}
          {...tableOptions}
        >
          {jobs.map((item, index) => (
            <TableItem key={index} item={item} />
          ))}
        </Table>
      </HStack>
    </BaseLayout>
  );
}
