import type { Network } from "darchlabs";

import { PolygonAvatarIcon, EthereumAvatarIcon, AvalancheAvatarIcon } from "@components/icon";

export const GetNetworkAvatar = (network: Network, size: number = 12) => {
  switch (network) {
    case "ethereum":
    case "rinkeby":
    case "goerli":
      return { ...(<EthereumAvatarIcon boxSize={size} />) };
    case "polygon":
    case "mumbai":
      return { ...(<PolygonAvatarIcon boxSize={size} />) };
    case "avalanche":
      return { ...(<AvalancheAvatarIcon boxSize={size} />) };
  }
};
