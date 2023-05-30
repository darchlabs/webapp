import Axios from "axios";
import { type Network, type Abi } from "darchlabs";
import { GetScanInfo } from "./get-scan-info";

type Response = {
  status: string;
  message: string;
  result: string;
};

export const GetABI = async (network: Network, address: string): Promise<Abi[]> => {
  const [ok, baseUrl, apiKey] = GetScanInfo(network);
  if (!ok) {
    throw new Error(`No scan found for the entered network=${network}`);
  }

  try {
    const url = `${baseUrl}?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
    const {
      data: { status, message, result },
    } = await Axios.get<Response>(url);

    if (status !== "1" || message !== "OK") {
      throw new Error("Invalid response from Etherscan API");
    }

    // parse abi string to json
    let parsedAbi;
    try {
      parsedAbi = JSON.parse(result);
    } catch (err) {
      throw new Error("Invalid JSON");
    }

    return parsedAbi;
  } catch (err: any) {
    throw err;
  }
};
