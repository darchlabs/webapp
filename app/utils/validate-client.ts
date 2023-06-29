import { ethers } from "ethers";
import { type Network, GetNetworkId } from "darchlabs";

export const ValidateClient = async (network: Network, url: string, isHttp: boolean = true): Promise<void> => {
  // get client
  let chainId = 0;
  try {
    const provider = isHttp ? ethers.JsonRpcProvider : ethers.WebSocketProvider;
    const client = new provider(url);
    const { chainId: id } = await client.getNetwork();
    chainId = Number(id.toString());
  } catch (err: any) {
    throw new Error("Invalid client while getting network, check the node url");
  }

  // validate client network
  if (chainId !== GetNetworkId(network)) {
    throw new Error("Client network doesn't match the given network, change node url or network");
  }
};
