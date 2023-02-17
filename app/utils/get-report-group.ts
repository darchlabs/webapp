import getLastAndCurrentDay from "./get-last-day";
import { redis } from "~/pkg/redis/redis.server";
import type { GroupReport } from "~/routes/admin/index";

// UNIX time is in seconds
const OneHour = 60 * 60; // 60 secs * 60 minutes

export default async function getReportGroup(
  service: string
): Promise<GroupReport[] | undefined> {
  // Assert the service name is valid
  if (
    service !== "jobs" &&
    service !== "synchronizers" &&
    service !== "nodes"
  ) {
    throw new Error("The service name is invalid");
  }

  // Get the service prefix for the redis keys
  const servicePrefix = `group-reports:${service}:`;

  // get all the keys matching that pattern from redis
  const serviceKeys = await redis.keys(`${servicePrefix}*`);
  if (serviceKeys.length === 0) {
    return undefined;
  }

  // Get last day and now timestamps in UNIX time
  let [lastDay, now] = getLastAndCurrentDay();

  // filter for only last day reports and sort it ascendently
  let lastDayKeys = getKeysByDate(servicePrefix, serviceKeys, lastDay, now);
  lastDayKeys = lastDayKeys.sort((a, b) => a - b);

  // Get the parsed batch of the keys
  const keysBatch = getKeys(servicePrefix, lastDayKeys);

  // Get the values with the already filtered keys batch
  const serviceGroup = (await redis.getBatch(keysBatch)) as GroupReport[];
  return serviceGroup;
}

function getKeysByDate(
  servicePrefix: string,
  serviceKeys: string[],
  firstDate: number,
  secondDate: number
): number[] {
  // Get len of the keys
  const keyDateLen = serviceKeys[0].toString().length;

  // Parse the units of the dates for being the same than the date keys
  firstDate = Number(firstDate.toString().substring(0, keyDateLen));
  secondDate = Number(secondDate.toString().substring(0, keyDateLen));

  // Filter keys on the given period
  let lastDayKeys: number[] = [];
  const filterKeys = serviceKeys.filter((key) => {
    const keyDate = Number(key.substring(servicePrefix.length));

    // adding an hiur for assuring we'll get at least 24 reports with an hour of difference
    if (keyDate >= firstDate || keyDate <= secondDate) {
      lastDayKeys.push(keyDate);
    }
  });

  return lastDayKeys;
}

// Parse the keys based on the service prefix and the time
function getKeys(servicePrefix: string, keys: number[]) {
  // Define array for pushing the filtered keys
  const keysBatch: string[] = [];
  // Filter by those reports that have supperior difference than the offset period
  const filterKeys = keys.filter((key) => {
    keysBatch.push(`${servicePrefix}${key}`);
  });

  return keysBatch;
}

// Get the parsed batch of the keys with an spefici period of difference
function getKeysWithOffset(
  servicePrefix: string,
  keys: number[],
  ofsetPeriod: number
) {
  // Define array for pushing the filtered keys
  const keysBatch: string[] = [];
  // Initialize variable for store the last key added
  let lastKeyAdded = 0;
  // Filter by those reports that have supperior difference than the offset period
  const filterKeys = keys.filter((key) => {
    if (key - lastKeyAdded > ofsetPeriod) {
      keysBatch.push(`${servicePrefix}${key}`);
      lastKeyAdded = key;
    }
  });

  return keysBatch;
}
