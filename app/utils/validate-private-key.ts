import { utils, network } from "darchlabs";
import { ethers } from "ethers";

export const ValidatePrivateKey = (network: network.Network, pk: string) => {
  // define provider
  const chainId = utils.GetNetworkId(network);
  const provider = ethers.getDefaultProvider(chainId);

  try {
    new ethers.Wallet(pk, provider);
  } catch (err) {
    throw err;
  }
};
