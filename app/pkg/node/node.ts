import fetch from "@remix-run/web-fetch";
import type { GetNodesStatusResponse, PostNewNodeResponse } from "./requests";

export default class Node {
    private URL: string;

    constructor(URL: string) {
        this.URL = URL;
    }

    public async PostNewNode(network: string, fromBlockNumber: number): Promise<PostNewNodeResponse> {
        try {
            const url = `${this.URL}/api/v1/nodes`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({network, fromBlockNumber}),
            });

            const data = (await res.json()) as PostNewNodeResponse;
            return data;
        } catch (err: any) {
            console.log(err)
            throw err;
        }
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