// type Interval = "1day" | "7days" | "1week" | "1month" | "3months" | "6months" | "1year" | "3years";
export type Interval = "1day" | "7days" | "1month" | "6months" | "1year";

// times
const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 12 * month;

// patterns
const timePattern = "HH:mm";
const dayPattern = "EEEE";
const monthPattern = "MMMM";

export const Intervals: {
  [key in Interval]: { key: Interval; diff: number; interval: number; title: string; pattern: string };
} = {
  "1day": {
    key: "1day",
    diff: day,
    interval: hour,
    title: "Last day",
    pattern: timePattern,
  },
  "7days": {
    key: "7days",
    diff: week,
    interval: day,
    title: "Last week",
    pattern: dayPattern,
  },
  "1month": {
    key: "1month",
    diff: month,
    interval: day,
    title: "Last month",
    pattern: dayPattern,
  },
  "6months": {
    key: "6months",
    diff: 6 * month,
    interval: 2 * week,
    title: "Last 6 months",
    pattern: monthPattern,
  },
  "1year": {
    key: "1year",
    diff: year,
    interval: month,
    title: "Last year",
    pattern: monthPattern,
  },
};
