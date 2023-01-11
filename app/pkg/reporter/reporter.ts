import type { ICache } from "../redis/types";
import type { GroupReport } from "./types";

export default class Reporter {
  private cache: ICache;

  constructor(cache: ICache) {
    if (cache == null) {
      throw new Error("cache param is not defined");
    }
  }

  public listSynchronizersReporters(): Promise<GroupReport> {
    // check redis connection
    // fetch to reporter database
    // normalize values

    return null;
  }
}
