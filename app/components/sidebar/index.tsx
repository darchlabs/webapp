import { Box, Text, Image, VStack, HStack, Flex, useMediaQuery } from "@chakra-ui/react";
import Logo from "../icon/logo";
import LogoSquare from "../icon/logo-square";

import { useLocation, Link } from "@remix-run/react";

import { VscPieChart, VscSync, VscSettingsGear, VscOrganization, VscBook, VscServerProcess } from "react-icons/vsc";
import { MdWorkspacesOutline } from "react-icons/md";

interface ItemProps {
  section: string;
  path: string;
  to: string;
  separator?: boolean;
}

const items: ItemProps[] = [
  {
    section: "Overview",
    path: "overview",
    to: "/admin",
  },
  {
    section: "Synchronizers",
    path: "synchronizers",
    to: "/admin/synchronizers",
  },
  {
    section: "Jobs",
    path: "jobs",
    to: "/admin/jobs",
  },
  {
    section: "Nodes",
    path: "nodes",
    to: "/admin/nodes",
    separator: true,
  },
  {
    section: "Settings",
    path: "settings",
    to: "/admin/settings",
  },
  {
    section: "Users",
    path: "users",
    to: "/admin/users",
  },
  {
    section: "Addresses",
    path: "addresses",
    to: "/admin/addresses",
  },
];

function getIconBySection(section: string) {
  switch (section.toLowerCase()) {
    case "overview":
      return <VscPieChart size={25} />;
    case "syncronizers":
      return <VscSync size={25} />;
    case "jobs":
      return <VscServerProcess size={25} />;
    case "nodes":
      return <MdWorkspacesOutline size={25} />;
    case "settings":
      return <VscSettingsGear size={25} />;
    case "users":
      return <VscOrganization size={25} />;
    case "addresses":
      return <VscBook size={25} />;
  }

  return <VscPieChart size={25} />;
}

export default function Sidebar() {
  const [AboveToLg] = useMediaQuery("(min-width: 62em)");
  const { pathname } = useLocation();

  return (
    <VStack
      spacing={"0px"}
      minW={{
        lg: "225px",
      }}
    >
      <Box pt={"30px"} pb={"32px"}>
        {AboveToLg ? <Image as={Logo} boxSize={"135px"} /> : <Image as={LogoSquare} boxSize={"55px"} />}
      </Box>

      <VStack width={"full"} alignItems={"stretch"}>
        {items.map((item, index) => {
          let active = false;
          const isAdmin = pathname.includes("/admin");
          if (isAdmin) {
            const [, path] = pathname.split("/admin");
            if (path === "") {
              // overview
              if (item.path === "overview") {
                active = true;
              }
            } else if (path.includes(item.path)) {
              active = true;
            }
          }

          return (
            <Link key={index} to={item.to}>
              <HStack
                bg={active ? "pink.500" : "white"}
                h={"56px"}
                color={active ? "white" : "#A4A6B3"}
                _hover={{
                  backgroundColor: "pink.500",
                  color: "white",
                  cursor: "pointer",
                }}
                borderBottom={item.separator ? "1px" : "0px"}
                borderBottomColor={"#E1E3E6"}
              >
                <Flex pl={"25px"} pr={"25px"} justifyContent={"center"} alignItems={"center"} alignContent="center">
                  {getIconBySection(item.section)}
                </Flex>
                {AboveToLg ? <Text fontSize={"16px"}>{item.section}</Text> : null}
              </HStack>
            </Link>
          );
        })}
      </VStack>
    </VStack>
  );
}
