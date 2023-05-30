import { type Network } from "darchlabs";

export type JobStatus = "idle" | "running" | "stopped" | "autoStopped" | "error";

export type Job = {
  id: string;
  name: string;
  providerId: string;
  status: JobStatus;
  network: Network;
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
  nodeURL: string;
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

export type JobInput = {
  name: string;
  providerId: string;
  network: Network;
  address: string;
  nodeUrl: string;
  privateKey: string;
  abi: string;
  type: "cronjob";
  cronjob: string;
  checkMethod: string;
  actionMethod: string;
};
