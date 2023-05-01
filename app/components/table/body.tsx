import { useNavigate, useLocation } from "@remix-run/react";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  TableCaption,
  HStack,
  Text,
  Stack,
  Select,
  Icon,
} from "@chakra-ui/react";
import type { Pagination } from "darchlabs";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export function Body({
  columns,
  pagination,
  children,
}: {
  columns: string[];
  pagination?: Pagination;
  children: JSX.Element[] | JSX.Element;
}) {
  // define hooks
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // define pagination botton table values
  let from = 0,
    to = 0;
  if (pagination) {
    to = pagination!.page * pagination!.limit;
    if (pagination!.page * pagination!.limit > pagination!.totalElements) {
      to = pagination!.totalElements;
    }
    from = pagination!.page * pagination!.limit - pagination!.limit + 1;
  }

  // define handlers
  function handleOnChangeLimit(value: string) {
    const queryParams = new URLSearchParams(search);
    queryParams.set("limit", value);

    navigate(`${pathname}?${queryParams.toString()}`);
  }
  function handleOnChangePage(action: "next" | "back") {
    const queryParams = new URLSearchParams(search);
    const page = action === "next" ? (pagination?.page ?? 0) + 1 : (pagination?.page ?? 0) - 1;
    queryParams.set("page", page.toString());

    navigate(`${pathname}?${queryParams.toString()}`);
  }

  return (
    <TableContainer w={"full"}>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th key={index} textTransform={"uppercase"} borderBottomColor={"blackAlpha.200"}>
                {column}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{children}</Tbody>
        {pagination && Array.isArray(children) && children.length > 0 ? (
          <TableCaption pt={0} mb={2}>
            <HStack justifyContent={"end"} spacing={4} mr={6}>
              <HStack pr={6}>
                <Text fontSize={"sm"} color={"blackAlpha.500"}>
                  Rows per page:
                </Text>
                <Stack spacing={3}>
                  <Select
                    variant="unstyled"
                    size={"sm"}
                    value={pagination.limit}
                    color={"#4B506D"}
                    onChange={(ev) => handleOnChangeLimit(ev.target.value)}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </Select>
                </Stack>
              </HStack>
              <HStack pr={2}>
                <Text fontSize={"sm"} color={"blackAlpha.500"}>
                  {from}-{to} of {pagination.totalElements}
                </Text>
              </HStack>
              {pagination.page > 1 ? (
                <HStack onClick={(ev) => handleOnChangePage("back")}>
                  <Icon as={RiArrowLeftSLine} boxSize={5} color={"blackAlpha.500"} />
                </HStack>
              ) : null}
              {to < pagination.totalElements ? (
                <HStack onClick={(ev) => handleOnChangePage("next")}>
                  <Icon as={RiArrowRightSLine} boxSize={5} color={"blackAlpha.500"} />
                </HStack>
              ) : null}
            </HStack>
          </TableCaption>
        ) : null}
      </Table>
    </TableContainer>
  );
}
