import { Queue } from "bullmq";
import IORedis from "ioredis";

import { REDIS_URL } from "./constants";

// export const redis_connection = new IORedis({
//     host: REDIS_HOST,
//     port: Number.parseInt(REDIS_PORT) || 6379,
//     maxRetriesPerRequest: null,
// });

export const redis_connection = new IORedis(REDIS_URL, {
    tls: { rejectUnauthorized: false },
    maxRetriesPerRequest: null,
});

redis_connection.on("connect", () => {
    console.log("Redis connection established");
});

redis_connection.on("error", (err) => {
    console.error("Redis connection error:", err);
});

const emailQueue = new Queue("emailQueue", {
    connection: redis_connection,
});

export { emailQueue };
