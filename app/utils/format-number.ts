export const FormatNumber = (num: number, fix: number = 1) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(fix) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(fix) + "K";
  }
  return num.toString();
};
