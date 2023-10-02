import { formatUnits } from "ethers";
import { network } from "darchlabs";

export function FormatEVM(n: network.Network, value: number, fix: number = 1): string {
  const { token } = network.NetworkInfo[n];
  const formatted = formatUnits(value.toString(), 18);
  const fixed = Number(formatted).toFixed(fix);

  return `${fixed} ${token}`;
}
