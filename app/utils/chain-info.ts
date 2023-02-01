export const ChainIds = {
  ethereum: 1,
  goerli: 5,
  polygon: 137,
  mumbai: 80001,
  binance: 56,
  avalanche: 43114,
  fuji: 43113,
  sepolia: 11155111,
};

export function getChainId(name: string) {
  const chains = Object.entries(ChainIds);

  let networkId: number = 0;
  for (let [networkName, id] of chains) {
    if (networkName === name) {
      networkId = id;
    }
  }

  if (networkId !== 0) {
    return networkId;
  }

  throw new Error(`Network id couldn't be found by the name ${name}`);
}

export function GetNetworkNodesUrl(): Map<string, string> {
  const chains = Object.entries(ChainIds);
  let nodesMap = new Map<string, string>();

  chains.map(([networkName, _]) => {
    let nodeUrl = process.env[`${networkName.toUpperCase()}_NODE_URL`];

    console.log("networkName: ", networkName, "|| node url:", nodeUrl);
    if (nodeUrl) {
      nodesMap.set(networkName, nodeUrl!);
    }
  });

  return nodesMap;
}
