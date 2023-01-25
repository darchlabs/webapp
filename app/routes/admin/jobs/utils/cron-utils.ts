const Second = 1;
const Minute = 60 * Second;
const Hour = 60 * Minute;
const Day = 24 * Hour;

const second = (seconds: number) => {
  return seconds * Second;
};

const minutes = (minutes: number) => {
  return minutes * Minute;
};

const hour = (hours: number) => {
  return hours * Hour;
};

const day = (days: number) => {
  return days * Day;
};

export const cronMap = new Map([
  [`*/${second(20)} * * * * *`, "Every 20 seconds"],
  [`*/${minutes(1)} * * * * *`, "Every minute"],
  [`*/${minutes(15)} * * * * *`, "Every 15 minutes"],
  [`*/${minutes(30)} * * * * *`, "Every 30 minutes"],
  [`*/${hour(1)} * * * * *`, "Every hour"],
  [`*/${hour(6)} * * * * *`, "Every 6 hours"],
  [`*/${day(1)} * * * * *`, "Every day"],
  ["custom", "Custom cron"],
]);
