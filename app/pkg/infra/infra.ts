import fetch from "@remix-run/web-fetch";
import type {
  GetByTokenResponse,
  GetUserResponse,
  LoginRespose,
} from "./requests";

export default class Infra {
  private URL: string;

  constructor(URL: string) {
    this.URL = URL;
  }

  public async Login(email: string, password: string): Promise<LoginRespose> {
    try {
      const url = `${this.URL}/api/v1/users`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as LoginRespose;
      return data;
    } catch (err: any) {
      throw err;
    }
  }

  public async GetUser(id: string): Promise<GetUserResponse> {
    try {
      const url = `${this.URL}/api/v1/users/${id}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = (await res.json()) as GetUserResponse;
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
