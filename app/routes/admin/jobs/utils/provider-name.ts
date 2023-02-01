import type { Provider } from "~/pkg/jobs/types";

export default function getProviderName(
  providers: Provider[],
  id: string
): string {
  let providerName = "";
  providers.map((provider) => {
    if (provider.id === id) {
      providerName = provider.name;
    }
    return providerName;
  });
  return providerName;
}
