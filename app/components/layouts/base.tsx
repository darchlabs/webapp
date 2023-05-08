import { HStack, VStack } from "@chakra-ui/react";
import { Sidebar } from "@components/sidebar";
import { Header } from "@components/header";

export const BaseLayout = ({
  title,
  subtitle,
  linkTo,
  linkFrom,
  children,
}: {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkFrom?: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <HStack alignItems={"start"} spacing={0}>
      <Sidebar />
      <VStack as={"section"} bg={"gray.50"} minW={0} w={"full"} h={"calc(100vh)"} px={[4, 4, 8]} mb={["14!", "0!"]}>
        <Header title={title} linkTo={linkTo} linkFrom={linkFrom} subtitle={subtitle} />
        {children}
      </VStack>
    </HStack>
  );
};
