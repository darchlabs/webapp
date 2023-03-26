export function GetColorSchemeByStatus(status: string): string {
  switch (status) {
    case "running":
      return "green";
    case "synching":
      return "yellow";
    case "error":
      return "red";
    case "stopped":
    case "stopping":
      return "gray";
  }

  return "gray";
}
