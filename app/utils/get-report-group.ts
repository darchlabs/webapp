import { redis } from "@models/redis.server";
import type { GroupReport } from "@routes/examples";

const OneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

export const getLastAndCurrentDay = (): [number, number] => {
  const now = new Date().getTime();
  // Diff between now and OneDay
  const lastDay = new Date(now - OneDay);
  const lastDayTimestamp = lastDay.getTime();

  return [lastDayTimestamp, now];
};

export const GetReportGroup = async (service: string): Promise<GroupReport[] | undefined> => {
  // Assert the service name is valid
  if (service !== "jobs" && service !== "synchronizers" && service !== "nodes") {
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
};

const getKeysByDate = (
  servicePrefix: string,
  serviceKeys: string[],
  firstDate: number,
  secondDate: number
): number[] => {
  // Get len of the keys
  const keyDateLen = serviceKeys[0].toString().length;

  // Parse the units of the dates for being the same than the date keys
  firstDate = Number(firstDate.toString().substring(0, keyDateLen));
  secondDate = Number(secondDate.toString().substring(0, keyDateLen));

  // Filter keys on the given period
  let lastDayKeys: number[] = [];

  serviceKeys.forEach((key) => {
    const keyDate = Number(key.substring(servicePrefix.length));

    // adding an hiur for assuring we'll get at least 24 reports with an hour of difference
    if (keyDate >= firstDate || keyDate <= secondDate) {
      lastDayKeys.push(keyDate);
    }
  });

  return lastDayKeys;
};

// Parse the keys based on the service prefix and the time
const getKeys = (servicePrefix: string, keys: number[]) => {
  // Define array for pushing the filtered keys
  const keysBatch: string[] = [];

  // Filter by those reports that have supperior difference than the offset period
  keys.forEach((key) => {
    keysBatch.push(`${servicePrefix}${key}`);
  });

  return keysBatch;
};
