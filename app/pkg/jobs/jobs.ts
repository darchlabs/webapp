import fetch from "@remix-run/web-fetch";
import type { ListProvidersResponse, ListJobsResponse } from "./requests";
import { type JobsRequest } from "./types";

export default class Jobs {
  private URL: string;

  constructor(URL: string) {
    this.URL = URL;
  }

  public async ListJobs(): Promise<ListJobsResponse> {
    try {
      const url = `${this.URL}/api/v1/jobs`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as ListJobsResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }

  public async ListProviders(): Promise<ListProvidersResponse> {
    try {
      const url = `${this.URL}/api/v1/jobs/providers`;
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

  public async CreateJob(req: JobsRequest): Promise<any> {
    try {
      const url = `${this.URL}/api/v1/jobs`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ job: req }),
      });

      const data = await res.json();
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
