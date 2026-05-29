"use server";

import { headers } from "next/headers";

import { rateLimiter } from "@/lib/rate-limiter";

type Handler = (req: Request) => Promise<Response>;

export function withRateLimit(handler: Handler): Handler {
    return async (req: Request): Promise<Response> => {
        const forwardedFor = req.headers.get("x-forwarded-for");

        const ip = forwardedFor?.split(",")[0].trim() || "anonymous";

        const { success } = await rateLimiter.limit(ip);

        if (!success) {
            return new Response(JSON.stringify({ message: "Too many requests" }), {
                status: 429,
                headers: { "Content-Type": "application/json" },
            });
        }

        return handler(req);
    };
}

// For Actions

type AsyncFunction<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

export async function withRateLimitAction<TArgs extends unknown[], TResult>(
    func: AsyncFunction<TArgs, TResult>
): Promise<AsyncFunction<TArgs, TResult>> {
    return async (...args: TArgs): Promise<TResult> => {
        const headerList = await headers();

        const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

        const { success } = await rateLimiter.limit(`action:${ip}`);

        if (!success) {
            throw new Error("Too many requests");
        }

        return func(...args);
    };
}
