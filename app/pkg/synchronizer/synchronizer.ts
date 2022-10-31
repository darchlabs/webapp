import fetch from "@remix-run/web-fetch";
import type { ListEventsResponse } from "./requests";

export default class Synchronizer {
  private URL: string;

  constructor(URL: string) {
    this.URL = URL;
  }

  public async ListEvents(): Promise<ListEventsResponse> {
    try {
      const url = `${this.URL}/api/v1/events`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as ListEventsResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
