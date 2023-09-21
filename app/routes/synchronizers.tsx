import { HStack, Text, VStack } from "@chakra-ui/react";
import { Outlet, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { Table } from "@components/table";
import { EmptyTable, TableItem } from "@components/synchronizers/smartcontracts";
import { BaseLayout } from "@components/layouts";
import { BaseError } from "@errors/base";
import { SmartContractsLoader, type SmartContractsLoaderData } from "./synchronizers.loader";

export const loader = SmartContractsLoader;
// export const ErrorBoundary = BaseError;

export const ErrorBoundary = () => {
  const error = useRouteError();
  const { pathname } = useLocation();
  if (isRouteErrorResponse(error)) {
    console.log(`App Error(isRouteErrorResponse) = ${error}`);
  } else {
    console.log(`App Error = ${error}`);
  }

  return <HStack w={"full"} h={"full"}>
    <VStack>
      <Text>
        404. That's an error.
      </Text>
      <Text>
        The requested URL {pathname} was not found on this server.
      </Text>
      <Text>
        That's all we know.
      </Text>
    </VStack>
  </HStack>;
};


export default function App() {
  const {
    smartcontracts: {
      data,
      meta: { pagination },
    },
    auth,
  } = useLoaderData() as SmartContractsLoaderData;

  const { pathname } = useLocation();

  const linkTo = "/synchronizers/create";
  const tableOptions = pathname.includes("/create") ? {} : { emptyTable: <EmptyTable createLink={linkTo} /> };

  return (
    <BaseLayout title="Synchronizers" linkTo={linkTo} auth={auth}>
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
