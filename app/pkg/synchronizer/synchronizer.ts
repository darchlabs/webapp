import fetch from "@remix-run/web-fetch";
import type { ListEventsResponse } from "./requests";
import parseAbi from "../utils/parse-abi";
import { Fetch } from "../utils/fetch";

export default class Synchronizers {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  public async ListEvents(): Promise<ListEventsResponse> {
    const url = `${this.baseURL}/api/v1/events`;
    return await Fetch<ListEventsResponse>("GET", url);
  }

  public async StartEvent(address: string, eventName: string): Promise<void> {
    const url = `${this.baseURL}/api/v1/events/${address}/${eventName}/start`;
    await Fetch<void>("POST", url);
  }

  public async StopEvent(address: string, eventName: string): Promise<void> {
    const url = `${this.baseURL}/api/v1/events/${address}/${eventName}/stop`;
    await Fetch<void>("POST", url);
  }

  public async DeleteEvent(address: string, eventName: string): Promise<void> {
    const url = `${this.baseURL}/api/v1/events/${address}/${eventName}`;
    await Fetch<void>("DELETE", url);
  }

  public async InsertEvent(
    address: string,
    network: string,
    abi: string,
    nodeURL: string
  ): Promise<ListEventsResponse> {
    try {
      console.log(1);
      const url = `${this.baseURL}/api/v1/events/${address}`;

      const parsedAbi = parseAbi(abi);
      console.log(2);

      const event = {
        abi: parsedAbi,
        network,
        nodeURL,
      };

      console.log(3);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          event,
        }),
      });
      console.log(4);

      const data = (await res.json()) as ListEventsResponse;
      console.log("data: ", data);
      return data;
    } catch (err: any) {
      console.log("errrorr: ", err);
      throw err;
    }
  }
}

// stop event
// start event
// get event
