const OneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

export default function getLastAndCurrentDay(): [number, number] {
  const now = new Date().getTime();
  // Diff between now and OneDay
  const lastDay = new Date(now - OneDay);
  const lastDayTimestamp = lastDay.getTime();

  return [lastDayTimestamp, now];
}
