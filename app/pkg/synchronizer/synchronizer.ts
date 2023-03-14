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
    abi: string,
    nodeURL: string
  ): Promise<ListEventsResponse> {
    try {
      console.log(1);
      const url = `${this.URL}/api/v1/events/${address}`;

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
