import { HStack, VStack } from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import { Outlet } from "@remix-run/react";

export default function App() {
  return (
    <HStack alignItems={"start"} spacing={"0px"}>
      <Sidebar />
      <VStack as={"section"} bg={"#F7F8FC"} minW={0} w={"full"} h={"calc(100vh)"} pl={"30px"} pr={"30px"}>
        <Outlet />
      </VStack>
    </HStack>
  );
}
