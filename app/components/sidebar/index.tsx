import { Box, Text, Image, VStack, HStack, Flex, useMediaQuery } from "@chakra-ui/react";
import Logo from "../icon/logo";
import LogoSquare from "../icon/logo-square";

import { VscPieChart, VscSync, VscSettingsGear, VscOrganization, VscBook, VscServerProcess } from "react-icons/vsc";
import { MdWorkspacesOutline } from "react-icons/md";

interface ItemProps {
  section: string;
  active: boolean;
  separator?: boolean;
}

const items: ItemProps[] = [
  {
    section: "Overview",
    active: false,
  },
  {
    section: "Syncronizers",
    active: true,
  },
  {
    section: "Jobs",
    active: false,
  },
  {
    section: "Nodes",
    active: false,
    separator: true,
  },
  {
    section: "Settings",
    active: false,
  },
  {
    section: "Users",
    active: false,
  },
  {
    section: "Addresses",
    active: false,
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

      {items.map((item, index) => (
        <HStack
          key={index}
          bg={item.active ? "pink.500" : "white"}
          width={"full"}
          h={"56px"}
          color={item.active ? "white" : "#A4A6B3"}
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
      ))}
    </VStack>
  );
}
