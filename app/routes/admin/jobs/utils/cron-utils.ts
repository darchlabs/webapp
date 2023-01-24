export type cronjob = {
  "0 * * * *": string;
  "0 */15 * * *": string;
  "0 */30 * * *": string;
  "0 0 * * *": string;
  "0 0 0 * *": string;
  "0 0 0 0 *": string;
  custom: string;
};

export const cronMap = {
  "0 * * * *": "Every minute",
  "0 */15 * * *": "Every 15 minutes",
  "0 */30 * * *": "Every 30 minutes",
  "0 0 * * *": "Every hour",
  "0 0 0 * *": "Every day",
  "0 0 0 0 *": "Every month",
  custom: "Custom cron",
} as cronjob;
