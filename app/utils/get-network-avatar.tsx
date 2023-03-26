import type { Network } from "../types";

import PolygonAvatar from "../components/icon/polygon-avatar";
import EthereumAvatar from "../components/icon/ethereum-avatar";
import AvalancheAvatar from "../components/icon/avalanche-avatar";
import BaseAvatar from "../components/icon/base-avatar";

export function GetNetworkAvatar(network: Network) {
  switch (network) {
    case "polygon":
      return <PolygonAvatar boxSize={12} />;
    case "ethereum":
      return <EthereumAvatar boxSize={12} />;
    case "avalanche":
      return <AvalancheAvatar boxSize={12} />;
  }

  return <BaseAvatar boxSize={12} />;
}
