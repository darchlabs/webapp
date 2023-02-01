import fetch from "@remix-run/web-fetch";
import type {
  ListProvidersResponse,
  ListJobsResponse,
  CreateJobResponse,
} from "./requests";
import type { JobsRequest } from "./types";

export default class Jobs {
  private URL: string;
  public networkNodesMap: Map<string, string>;

  constructor(URL: string, netNodesMap: Map<string, string>) {
    this.URL = URL;
    this.networkNodesMap = netNodesMap;
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

  public async CreateJob(req: JobsRequest): Promise<CreateJobResponse> {
    try {
      const url = `${this.URL}/api/v1/jobs`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ job: req }),
      });

      const data = (await res.json()) as CreateJobResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
