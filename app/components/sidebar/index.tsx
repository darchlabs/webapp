import { useLocation, Link, useFetcher } from "@remix-run/react";
import { Box, Text, Image, HStack, VStack, Flex, useMediaQuery, theme, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, useDisclosure } from "@chakra-ui/react";

import { LogoIcon } from "../icon/logo";
import { LogoSquareIcon } from "../icon/logo-square";
import { GetIconBySection } from "./get-icon-by-section";
import { Items } from "./data";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AiOutlineApi } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { AuthData } from "@middlewares/with-auth";
import { CreateApiKeyModal } from "@components/api-keys/create-api-key-modal";

export function Sidebar({ auth }: { auth: AuthData }) {
  // define hooks
  const [AboveToLg] = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
  const [BelowToSm] = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    fetcher.submit(null, {
      method: "post",
      action: `/logout/action`,
    });
  }

  const createApiKeyHandler = () => {
    onOpen();
    return;
  }

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
      h={"full"}
      justifyContent={"space-between"}
    >
      <VStack>
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
      </VStack>

      <Flex>
        <Menu>
          <MenuButton
            _hover={{ bg: 'blackAlpha.200' }}
            w={"full"}
            display={"flex"}
            justifyContent={"center"}
          >
            {AboveToLg ? (
              <HStack justifyContent={"space-between"} px={5} py={3}>
                <HStack>
                  <Avatar bgColor={"pink.500"} name={auth.email[0]} size={"sm"} />
                  <Text color={"blackAlpha.800"}>
                    {auth.email.split("@")[0]}
                  </Text>
                </HStack>
                <BsThreeDots />
              </HStack>
            ) : (
              <HStack justifyContent={"space-between"} px={5} py={3}>
                <Avatar bgColor={"pink.500"} name={auth.email[0]} size={"sm"} />
              </HStack>
            )}
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<AiOutlineApi size={20} />}
              color={"blackAlpha.800"}
              onClick={createApiKeyHandler}
            >
              Create API Key
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<RiLogoutBoxRLine size={18} />}
              onClick={logoutHandler}
              color={"blackAlpha.800"}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
        <CreateApiKeyModal isOpen={isOpen} onClose={onClose} />
      </Flex>
    </Flex>
  );
}
