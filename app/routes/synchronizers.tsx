import { HStack } from "@chakra-ui/react";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Table } from "@components/table";
import { EmptyTable, TableItem } from "@components/synchronizers/smartcontracts";
import { BaseLayout } from "@components/layouts";
import { BaseError } from "@errors/base";
import { SmartContractsLoader, type SmartContractsLoaderData } from "./synchronizers.loader";

export const loader = SmartContractsLoader;
export const ErrorBoundary = BaseError;

export default function App() {
  const {
    smartcontracts: {
      data,
      meta: { pagination },
    },
  } = useLoaderData<SmartContractsLoaderData>();
  const { pathname } = useLocation();

  const linkTo = "/synchronizers/create";
  const tableOptions = pathname.includes("/create") ? {} : { emptyTable: <EmptyTable createLink={linkTo} /> };

  return (
    <BaseLayout title="Synchronizers" linkTo={linkTo}>
      <Outlet />

      <HStack justifyContent={"center"} w={"full"} pt={"20px"}>
        <Table
          title="smart contracts"
          columns={["Name", "Network", "SC Status", "Events Status", ""]}
          pagination={pagination}
          emptyMsg={"You do not have any registered smart contracts."}
          {...tableOptions}
        >
          {data.map((item, index) => (
            <TableItem key={index} item={item} />
          ))}
        </Table>
      </HStack>
    </BaseLayout>
  );
}
