import fetch from "@remix-run/web-fetch";
import type { GetNodesStatusResponse } from "./requests";

export default class Node {
    private URL: string;

    constructor(URL: string) {
        this.URL = URL;
    }

    public async GetStatus(): Promise<GetNodesStatusResponse> {
        try {
            const url = `${this.URL}/api/v1/nodes/status`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            });

            const data = (await res.json()) as GetNodesStatusResponse;
            return data;
        } catch (err: any) {
            console.log(err)
            throw err;
        }
    }
}