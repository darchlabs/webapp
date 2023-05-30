import { formatUnits } from "ethers";
import { NetworkInfo, type Network } from "darchlabs";

export function FormatEVM(network: Network, value: number, fix: number = 1): string {
  const { token } = NetworkInfo[network];
  const formatted = formatUnits(value.toString(), 18);
  const fixed = Number(formatted).toFixed(fix);

  return `${fixed} ${token}`;
}
