enum Status {
  synchronizers = "synchronizers",
  jobs = "jobs",
  nodes = "nodes",
}

export type Report = {
  id: string;
  status: string;
  createdAt: Date;
};

export type GroupReport = {
  type: Status;
  reports: Report[];
  createdAt: Date;
};
