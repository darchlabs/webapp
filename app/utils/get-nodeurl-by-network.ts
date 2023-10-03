import { network } from "darchlabs";

const { ETHEREUM_NODE_URL, POLYGON_NODE_URL, MUMBAI_NODE_URL } = process.env;

export const GetNodeUrlByNetwork = (network: network.Network): string | undefined => {
  switch (network) {
    case "ethereum":
      return ETHEREUM_NODE_URL!;
    case "polygon":
      return POLYGON_NODE_URL!;
    case "mumbai":
      return MUMBAI_NODE_URL!;
  }

  return undefined
}