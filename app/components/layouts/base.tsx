import { HStack, VStack } from "@chakra-ui/react";
import { Sidebar } from "@components/sidebar";
import { Header } from "@components/header";
import { AuthData } from "@middlewares/with-auth";

export const BaseLayout = ({
  title,
  subtitle,
  linkTo,
  linkFrom,
  auth,
  children,
}: {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkFrom?: string;
  auth: AuthData;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <HStack alignItems={"start"} spacing={0} h={"100vh"}>
      <Sidebar auth={auth} />
      <VStack
        as={"section"}
        bg={"gray.50"}
        minW={0}
        w={"full"}
        h={"full"}
        px={[4, 4, 8]}
        mb={["14!", "0!"]}
        overflow="auto"
      >
        <Header title={title} linkTo={linkTo} linkFrom={linkFrom} subtitle={subtitle} />
        {children}
      </VStack>
    </HStack>
  );
};
