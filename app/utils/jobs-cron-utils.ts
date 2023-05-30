const Second = 1;
const Minute = 60 * Second;
const Hour = 60 * Minute;
const Day = 24 * Hour;

export const CronjobValues = [
  { value: `*/${20 * Second} * * * * *`, text: "Every 20 seconds" },
  { value: `*/${1 * Minute} * * * * *`, text: "Every minute" },
  { value: `*/${15 * Minute} * * * * *`, text: "Every 15 minutes" },
  { value: `*/${30 * Minute} * * * * *`, text: "Every 30 minutes" },
  { value: `*/${1 * Hour} * * * * *`, text: "Every hour" },
  { value: `*/${6 * Hour} * * * * *`, text: "Every 6 hours" },
  { value: `*/${1 * Day} * * * * *`, text: "Every day" },
];
