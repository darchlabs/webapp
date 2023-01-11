import type { CronjobStatus, Network } from "~/types";

export type Job = {
  id: string;
  name: string;
  providerId: string;
  status: CronjobStatus;
<<<<<<< HEAD
  network: Network;
=======
  network: string;
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
  address: string;
  abi: string;
  nodeUrl: string;
  privateKey: string;
  type: string;
  cronjob: string;
  checkMethod: string;
  actionMethod: string;
  // add as time module
  createdAt: string;
  updatedAt: string;
  logs: string[];
};

export type Provider = {
  id: string;
  name: string;
  networks: Network[];
};

export type JobsForm = {
  providerId: string;
  network: Network;
  address: string;
  abi: string;
  cronjob: string;
  checkMethod: string;
  actionMethod: string;
  privateKey: string;
  raw?: string;
};

export type JobsFormData = JobsForm & {};

export type JobsRequest = {
  name: string;
  providerId: string;
  network: string;
  address: string;
  abi: string;
  nodeUrl: string;
  privateKey: string;
  type: string;
  cronjob: string;
  checkMethod: string;
  actionMethod: string;
};
