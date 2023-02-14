export function getHoursPeriodArr(hours: number): string[] {
  const hoursArray: string[] = [];
  for (let i = 0; i < hours + 1; i++) {
    hoursArray.push((i % 25).toString().padStart(2, "0"));
  }

  return hoursArray;
}
