import { HStack } from "@chakra-ui/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { NodesLoader } from "./nodes.loader";
import { type LoaderData } from "./nodes.loader";
import { BaseLayout } from "@components/layouts";
import { Table } from "@components/table";
import { EmptyTable } from "@components/nodes/empty-table";
import { useLocation } from "@remix-run/react";
import { TableItem } from "@components/nodes/table-item";
import { BaseError } from "@errors/base";

export const loader = NodesLoader;
export const ErrorBoundary = BaseError;

export default function App() {
  // define hooks
  const { nodes, origin } = useLoaderData() as LoaderData;
  const { pathname } = useLocation();

  const linkTo = "/nodes/create";
  const tableOptions = pathname.includes("/create") ? {} : { emptyTable: <EmptyTable createLink={linkTo} /> };

  return (
    <BaseLayout title="Nodes" linkTo={linkTo}>
      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Table
          title="nodes"
          columns={["Nodes Details", "Network", "Status", "URL", ""]}
          emptyMsg={"You do not have any registered nodes."}
          {...tableOptions}
        >
          {nodes.map((item, index) => (
            <TableItem key={index} item={item} urlOrigin={origin} />
          ))}
        </Table>
      </HStack>
    </BaseLayout>
  );
}
