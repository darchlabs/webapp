import fetch from "@remix-run/web-fetch";
import type { ListProvidersResponse } from "./requests";

export default class Jobs {
  private URL: string;

  constructor(URL: string) {
    this.URL = URL;
  }

  public async ListProviders(): Promise<ListProvidersResponse> {
    try {
      const url = `${this.URL}/api/v1/providers`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as ListProvidersResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
