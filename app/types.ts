export type Network =
  | "ethereum"
  | "rinkeby"
  | "polygon"
  | "mumbai"
  | "avalanche"
  | "goerli"
  | "none";

export type CronjobStatus =
  | "idle"
  | "running"
  | "stopping"
  | "stopped"
  | "error"
  | "sync";

export type Cronjob = {
  status: CronjobStatus;
  seconds: number;
};
