import { useLocation } from "react-router-dom";
import { HStack, VStack, Text, Button, Icon } from "@chakra-ui/react";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { Link } from "@remix-run/react";

export function Header({ title, length, subHeader }: { title: string; length: number; subHeader?: JSX.Element }) {
  // define hooks
  const { pathname, search } = useLocation();

  // get sort query param
  const queryParams = new URLSearchParams(search);
  const sort = queryParams.get("sort") || "desc";
  queryParams.set("sort", sort === "asc" ? "desc" : "asc");

  // set sort icon
  const sortIcon = sort === "asc" ? RiSortAsc : RiSortDesc;

  return (
    <HStack w={"full"} px={[5, 5, 8]} pt={8} pb={4} justifyContent={"space-between"} alignItems="start">
      <VStack alignItems={"start"} spacing={1}>
        <Text fontWeight={"bold"} fontSize={"lg"}>
          All {title} ({length})
        </Text>
        {subHeader}
      </VStack>

      <HStack spacing={6}>
        <HStack>
          <Link to={`${pathname}?${queryParams.toString()}`}>
            <Button
              leftIcon={<Icon boxSize={5} color={"blackAlpha.300"} as={sortIcon} />}
              colorScheme="pink"
              variant="ghost"
              color="blackAlpha.700"
            >
              Sort
            </Button>
          </Link>
        </HStack>
      </HStack>
    </HStack>
  );
}
