import { type Network } from "darchlabs";

export type Node = {
  id: string;
  name: string;
  chain: string;
  port: string;
  fromBlockNumber: number;
  status: string;
};

type _nodeFormData = {
  network: Network;
  fromBlockNumber: number;
};

export type NodeBase = {
  network: Network;
  fromBlockNumber: number;
};

export type NodeFormData = _nodeFormData & {};
