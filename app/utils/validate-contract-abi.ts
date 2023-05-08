import { ethers } from "ethers";
import { type Network, GetNetworkId } from "darchlabs";

export const ValidateContractAbi = async (network: Network, address: string, abi: string) => {
  // define provider
  const chainId = GetNetworkId(network);
  const provider = ethers.getDefaultProvider(chainId);

  // check if the contract abi format is correct by instancing it
  try {
    new ethers.Contract(address, abi, provider);
  } catch (err) {
    throw err;
  }
};
