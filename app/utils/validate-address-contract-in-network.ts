import { ethers } from "ethers";
import { type Network, GetNetworkId } from "darchlabs";

export const ValidateAddressContractInNetwork = async (network: Network, address: string): Promise<void> => {
  // define provider and get code
  const chainId = GetNetworkId(network);
  const provider = ethers.getDefaultProvider(chainId);
  const code = await provider.getCode(address);

  // validate code
  if (code === "0x") {
    throw new Error(`The address is not deployed on the ${network} network`);
  }
};