import type { Network } from "../../types";

type _synchronizer = {
  network: Network;
  address: string;
  raw?: string;
};

export type SynchronizerFormData = _synchronizer & {
  abi: string;
  event: string;
  nodeURL: string;
};

export type SynchronizerStatus = "synching" | "running" | "stopped" | "error";

export type Synchronizer = {
  id?: string;
  network: Network;
  nodeURL: string;
  address: string;
  latestBlockNumber: number;
  abi: Abi;
  status: SynchronizerStatus;
  error: string;
  createdAt: string;
  updatedAt: string;
};

export type AbiInput = {
  indexed: boolean;
  internalType: string;
  name: string;
  type: string;
};

export type Abi = {
  anonymous: boolean;
  inputs: AbiInput[];
  name: string;
  type: string;
};
