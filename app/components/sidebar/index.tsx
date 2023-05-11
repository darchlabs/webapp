import { useLocation, Link } from "@remix-run/react";
import { Box, Text, Image, HStack, Flex, useMediaQuery, theme } from "@chakra-ui/react";

import { LogoIcon } from "../icon/logo";
import { LogoSquareIcon } from "../icon/logo-square";
import { GetIconBySection } from "./get-icon-by-section";
import { Items } from "./data";

export function Sidebar() {
  const [AboveToLg] = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
  const [BelowToSm] = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { pathname } = useLocation();

  return (
    <Flex
      flexDirection={["row", "column"]}
      minW={["full", "auto", "auto", 60]}
      width={["full", "auto"]}
      bottom={[0, "inherit"]}
      position={["fixed", "inherit"]}
      borderWidth={[1, 0]}
      borderStyle={"solid"}
      borderColor={["blackAlpha.200"]}
    >
      {!BelowToSm ? (
        <HStack pt={8} pb={8} justifyContent={"center"}>
          {AboveToLg ? <Image as={LogoIcon} boxSize={"135px"} /> : <Image as={LogoSquareIcon} boxSize={"55px"} />}
        </HStack>
      ) : null}

      {Items.map((item, index) => {
        let active = false;
        for (const path of item.paths) {
          if (pathname.includes(path)) {
            active = true;
            break;
          }
        }

        return (
          <Box key={index} flex={1} width={"full"}>
            <Link to={item.to}>
              <HStack
                bg={active ? "pink.400" : "white"}
                w={"full"}
                h={14}
                color={active ? "white" : "blackAlpha.500"}
                _hover={{
                  backgroundColor: "pink.400",
                  color: "white",
                  cursor: "pointer",
                }}
                borderBottom={item.separator ? 1 : 0}
                borderBottomColor={"blackAlpha.200"}
                justifyContent={["center", "start"]}
              >
                <Flex pl={6} pr={6} justifyContent={"center"} alignItems={"center"} alignContent="center">
                  {GetIconBySection(item.icon)}
                </Flex>
                {AboveToLg ? <Text fontSize={"md"}>{item.section}</Text> : null}
              </HStack>
            </Link>
          </Box>
        );
      })}
    </Flex>
  );
}
