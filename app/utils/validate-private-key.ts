import { GetNetworkId, type Network } from "darchlabs";
import { ethers } from "ethers";

export const ValidatePrivateKey = (network: Network, pk: string) => {
  // define provider
  const chainId = GetNetworkId(network);
  const provider = ethers.getDefaultProvider(chainId);

  try {
    new ethers.Wallet(pk, provider);
  } catch (err) {
    throw err;
  }
};
