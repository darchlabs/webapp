
import type { Node } from "./types";

export type GetNodesStatusResponse = {
  data: {
    nodes: Node[];
  };
};

export type PostNewNodeResponse = {
  data: {
    id: string;
    name: string;
    chain: string;
    port: number;
    status: string;
  }
};
