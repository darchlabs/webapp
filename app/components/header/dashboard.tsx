import { Avatar, Button, Flex, Heading, HStack, Show, Text } from "@chakra-ui/react";
import { Link, useLocation } from "@remix-run/react";
import NotificationIcon from "../../components/icon/notification";

export default function DashboardHeader({ title }: { title: string }) {
  const { pathname } = useLocation();
  const showCreateSync = pathname.indexOf("create") >= 0 ? true : false;
  console.log("here in dashboard", showCreateSync, pathname);

  return (
    <HStack pt={"40px"} mb={"40px"} w={"full"} justifyContent={"space-between"}>
      <Heading color={"#252733"} fontSize={"24px"}>
        {title}
      </Heading>

      <HStack spacing={"20px"}>
        {!showCreateSync ? (
          <>
            <Show above="md">
              <Link to="/admin/synchronizers/create/network">
                <Button size={"sm"} colorScheme={"pink"}>
                  CREATE SYNCHRONIZER
                </Button>
              </Link>
            </Show>
            <Show below="md">
              <Link to="/admin/synchronizers/create/network">
                <Button size={"sm"} colorScheme={"pink"}>
                  CREATE
                </Button>
              </Link>
            </Show>
          </>
        ) : null}

        <Flex justifyItems={"center"} alignItems={"center"}>
          <NotificationIcon boxSize={8} />
        </Flex>

        <Show above="md">
          <Text fontWeight={"medium"} fontSize={"16px"} color={"#252733"}>
            El Diego
          </Text>
        </Show>

        <Flex>
          <Avatar
            border={"2px solid #DFE0EB"}
            size={"md"}
            src="https://tmssl.akamaized.net/images/foto/galerie/diego-maradona-1401100569-36.jpg?lm=1483605486"
          />
        </Flex>
      </HStack>
    </HStack>
  );
}
