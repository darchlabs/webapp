type Method = "GET" | "POST" | "DELETE";

export async function Fetch<T>(method: Method, url: string) {
  const res = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
  });

  const data = (await res.json()) as T;
  return data;
}
