import { VscPieChart, VscSettingsGear, VscOrganization, VscBook, VscServerProcess } from "react-icons/vsc";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdWorkspacesOutline } from "react-icons/md";

export const GetIconBySection = (section: string) => {
  switch (section.toLowerCase()) {
    case "overview":
      return <VscPieChart size={25} />;
    case "jobs":
      return <VscServerProcess size={25} />;
    case "nodes":
      return <MdWorkspacesOutline size={25} />;
    case "settings":
      return <VscSettingsGear size={25} />;
    case "addresses":
      return <VscBook size={25} />;
    case "metrics":
      return <VscPieChart size={25} />;
    case "synchronizers":
      return <HiOutlineDocumentText size={25} />;
    case "users":
      return <VscOrganization size={25} />;
  }

  return null;
};
