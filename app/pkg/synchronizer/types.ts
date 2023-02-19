import type { Network } from "../../types";

type _synchronizer = {
  network: Network;
  address: string;
  raw?: string;
};

export type SynchronizerFormData = _synchronizer & {
  abi: string;
  event: string;
};

export type SynchronizerBase = {
  latestBlockNumber: number;
  abi: Abi;
};

export type Synchronizer = SynchronizerBase & {
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
