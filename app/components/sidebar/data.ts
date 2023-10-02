export const Items: {
  section: string;
  paths: string[];
  to: string;
  icon: string;
  separator?: boolean;
}[] = [
    {
      section: "Overview",
      paths: ["/overview"],
      to: "/",
      icon: "overview",
    },
    {
      section: "Synchronizers",
      paths: ["/synchronizers", "/events"],
      to: "/synchronizers",
      icon: "synchronizers",
    },
    {
      section: "Jobs",
      paths: ["jobs"],
      to: "/jobs",
      icon: "jobs",
    },
    // {
    //   section: "Nodes",
    //   paths: ["nodes"],
    //   to: "/nodes",
    //   icon: "nodes",
    //   separator: true,
    // },
    // {
    //   section: "Settings",
    //   paths: ["settings"],
    //   to: "/settings",
    //   icon: "settings",
    // },
    // {
    //   section: "Users",
    //   paths: ["users"],
    //   to: "/users",
    //   icon: "users",
    // },
    // {
    //   section: "Addresses",
    //   paths: ["addresses"],
    //   to: "/addresses",
    //   icon: "addresses",
    // },
  ];
