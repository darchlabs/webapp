import { VStack, Text, Tr, Td } from "@chakra-ui/react";

import { Body } from "./body";
import { Header } from "./header";
import type { Pagination } from "darchlabs";

export function Table({
  title,
  columns,
  subHeader,
  emptyMsg,
  emptyTable,
  pagination,
  children,
}: {
  title: string;
  columns: string[];
  subHeader?: JSX.Element;
  emptyMsg: string;
  emptyTable?: JSX.Element;
  pagination?: Pagination;
  children: JSX.Element[];
}) {
  if (!children.length && emptyTable) {
    return emptyTable;
  }

  // define header table length
  const length = pagination?.totalElements || children.length;

  return (
    <VStack
      w={"full"}
      maxW={"1000px"}
      alignItems={"start"}
      bg={"white"}
      borderStyle={"solid"}
      borderWidth={1}
      borderColor={"blackAlpha.200"}
      borderRadius={8}
    >
      <Header title={title} length={length} subHeader={subHeader} pagination={pagination} />
      <Body columns={columns} pagination={pagination}>
        {children.length ? (
          children
        ) : (
          <Tr>
            <Td colSpan={columns.length}>
              <Text py={[3]} textAlign={"center"} color="blackAlpha.800">
                {emptyMsg}
              </Text>
            </Td>
          </Tr>
        )}
      </Body>
    </VStack>
  );
}
