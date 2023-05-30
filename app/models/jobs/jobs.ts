import fetch from "@remix-run/web-fetch";
import type { ListProvidersResponse, ListJobsResponse, CreateJobResponse, HTTPResponse } from "./requests";
import type { JobInput } from "./types";

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

  public async CreateJob(req: JobInput): Promise<CreateJobResponse> {
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

  public async DeleteJob(id: string): Promise<HTTPResponse> {
    try {
      const url = `${this.URL}/api/v1/jobs/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as HTTPResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }

  public async StartJob(id: string): Promise<HTTPResponse> {
    try {
      const url = `${this.URL}/api/v1/jobs/${id}/start`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as HTTPResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }

  public async StopJob(id: string): Promise<HTTPResponse> {
    try {
      const url = `${this.URL}/api/v1/jobs/${id}/stop`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as HTTPResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
