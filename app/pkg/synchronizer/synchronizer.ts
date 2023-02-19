import fetch from "@remix-run/web-fetch";
import type { ListEventsResponse } from "./requests";
import parseAbi from "../utils/parse-abi";

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

  public async InsertEvent(
    address: string,
    network: string,
    abi: string
  ): Promise<ListEventsResponse> {
    try {
      const url = `${this.URL}/api/v1/events/${address}`;

      const parsedAbi = parseAbi(abi);

      const event = {
        abi: parsedAbi,
        network,
        type: "event",
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          event,
        }),
      });

      const data = (await res.json()) as ListEventsResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
