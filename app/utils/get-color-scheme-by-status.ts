export const GetColorSchemeByStatus = (status: string): string => {
  switch (status) {
    case "running":
      return "green";
    case "synching":
      return "yellow";
    case "error":
    case "quota_exceeded":
    case "autoStopped":
      return "red";
    case "idle":
    case "stopped":
    case "stopping":
      return "gray";
  }

  return "gray";
};
