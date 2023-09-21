import { type Network } from "darchlabs";

const { ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY } = process.env;

export const GetScanInfo = (network: Network): [ok: boolean, url: string, apiKey: string] => {
  switch (network) {
    case "ethereum":
      return [true, "https://api.etherscan.io/api", ETHERSCAN_API_KEY!];
    case "polygon":
      return [true, "https://api.polygonscan.com/api", POLYGONSCAN_API_KEY!];
    case "mumbai":
      return [true, "https://api-testnet.polygonscan.com/api", POLYGONSCAN_API_KEY!]
  }

  return [false, "", ""];
};
