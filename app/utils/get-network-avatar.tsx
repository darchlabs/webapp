import type { Network } from "darchlabs";

import {
  PolygonAvatarIcon,
  EthereumAvatarIcon,
  AvalancheAvatarIcon,
  CeloAvatarIcon,
  ChainlinkAvatarIcon,
} from "@components/icon";

export const GetNetworkAvatar = (network: Network, size: number = 12) => {
  switch (network) {
    case "ethereum":
    case "rinkeby":
    case "goerli":
    case "sepolia":
      return { ...(<EthereumAvatarIcon boxSize={size} />) };
    case "polygon":
    case "mumbai":
      return { ...(<PolygonAvatarIcon boxSize={size} />) };
    // case "avalanche":
    // return { ...(<AvalancheAvatarIcon boxSize={size} />) };
    case "celo":
    case "alfajores":
      return { ...(<CeloAvatarIcon boxSize={size} />) };
    case "chainlink":
    case "chainlink_sepolia":
      return { ...(<ChainlinkAvatarIcon boxSize={size} />) };
  }
};
