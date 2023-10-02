import { ethers } from "ethers";
import { network, utils } from "darchlabs";

export const ValidateContractAbi = async (network: network.Network, address: string, abi: string) => {
  // define provider
  const chainId = utils.GetNetworkId(network);
  const provider = ethers.getDefaultProvider(chainId);

  // check if the contract abi format is correct by instancing it
  try {
    new ethers.Contract(address, abi, provider);
  } catch (err) {
    throw err;
  }
};
