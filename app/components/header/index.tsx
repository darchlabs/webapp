import { Box, Button, Flex, Heading, HStack, Show, Text, VStack } from "@chakra-ui/react";
import { Link, useLocation } from "@remix-run/react";
import { NotificationIcon } from "../icon/notification";
import { TfiAngleLeft } from "react-icons/tfi";

export const Header = ({
  title,
  subtitle,
  linkTo,
  linkFrom,
}: {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkFrom?: string;
}) => {
  const { pathname } = useLocation();

  return (
    <HStack pt={10} mb={[5, 5, 7, 10]} w={"full"} justifyContent={"space-between"} alignItems={"start"}>
      <HStack>
        {linkFrom ? (
          <Box mr={3}>
            <Link to={linkFrom}>
              <TfiAngleLeft size={40} color={"blackAlpha.500"} />
            </Link>
          </Box>
        ) : null}
        <VStack spacing={0} alignItems={"start"}>
          <Heading color={"blackAlpha.800"} fontSize={["xl", "2xl", "3xl"]}>
            {title}
          </Heading>
          {subtitle ? (
            <Text
              color={"gray.500"}
              fontSize={["sm", "md"]}
              fontWeight={"light"}
              whiteSpace={"nowrap"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              maxWidth={[40, 60, "full"]}
            >
              {subtitle}
            </Text>
          ) : null}
        </VStack>
      </HStack>

      <HStack spacing={5}>
        {linkTo && !pathname.includes(linkTo) ? (
          <>
            <Show above="md">
              <Link to={linkTo}>
                <Button size={"md"} colorScheme={"pink"} bgColor={"pink.400"}>
                  CREATE NEW
                </Button>
              </Link>
            </Show>
            <Show below="md">
              <Link to={linkTo}>
                <Button size={"sm"} colorScheme={"pink"} bgColor={"pink.400"}>
                  CREATE
                </Button>
              </Link>
            </Show>
          </>
        ) : null}

        {/* <Flex justifyItems={"center"} alignItems={"center"}>
          <NotificationIcon boxSize={8} color={"blackAlpha.800"} />
        </Flex> */}
      </HStack>
    </HStack>
  );
};
