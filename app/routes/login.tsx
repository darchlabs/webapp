import { VStack } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function () {
  return (
    <VStack>
      <Outlet />
    </VStack>
  );
}
