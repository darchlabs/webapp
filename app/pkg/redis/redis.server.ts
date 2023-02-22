import Redis from ".";
import invariant from "tiny-invariant";

let redis: Redis;

declare global {
  var __cache__: Redis;
}

(async () => {
  if (process.env.NODE_ENV === "production") {
    redis = await getClient();
    console.log("redis", redis);
  } else {
    if (!global.__cache__) {
      global.__cache__ = await getClient();
    }
    redis = global.__cache__;
  }
})();

async function getClient() {
  const { REDIS_URL } = process.env;
  invariant(typeof REDIS_URL === "string", "REDIS_URL env var not set");

  const client = new Redis(REDIS_URL);

  console.log("before connect");
  await client.connect();
  console.log("after connect");

  return client;
}

export { redis };
