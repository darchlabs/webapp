import type { Network } from "../../types";

export type Job = {
  // TODO(nb): complete all the fields
  id: string;
};

export type Provider = {
  id: string;
  name: string;
  networks: Network[];
};
