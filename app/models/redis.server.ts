import Redis from "./redis";
import invariant from "tiny-invariant";

let redis: Redis;

declare global {
  var __cache__: Redis;
}

if (process.env.NODE_ENV === "production") {
  redis = getClient();
} else {
  if (!global.__cache__) {
    global.__cache__ = getClient();
  }
  redis = global.__cache__;
}

function getClient() {
  const { REDIS_URL } = process.env;
  invariant(typeof REDIS_URL === "string", "REDIS_URL env var not set");

  console.log("before connect");
  const client = new Redis(REDIS_URL);
  client
    .connect()
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log("error in redis connection", err);
    });
  console.log("after connect");

  return client;
}

export { redis };
