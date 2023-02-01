export const errorsRedirectMap = new Map([
  ["INVALID_ADDRESS", "/admin/jobs/create/provider"],
  ["INVALID_ABI", "/admin/jobs/create/contract"],
  ["INVALID_CONTRACT", "/admin/jobs/create/contract"],
  ["INVALID_CRON", "/admin/jobs/create/cron"],
  ["INVALID_SIGNER", "/admin/jobs/create/account"],
]);

export const errorsMsgMap = new Map([
  ["INVALID_NETWORK", "The network is invalid"],
  ["INVALID_ABI", "The abi is invalid"],
  [
    "INVALID_ADDRESS",
    "The address doesn't exist on that network. Check the address and the network",
  ],
  [
    "INVALID_CONTRACT",
    "The contract doesn't exist. The combination between address and abi is invalid",
  ],
  ["INVALID_CRON", "The cron is invalid"],
  ["INVALID_SIGNER", "The account is invalid"],
]);
