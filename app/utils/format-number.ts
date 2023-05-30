export const FormatNumber = (num: number, fix: number = 1): string => {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(fix) + "T";
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(fix) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(fix) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(fix) + "K";
  }
  return num.toString();
};
