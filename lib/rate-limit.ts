import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * Fixed-window rate limiter backed by Postgres, so the limit holds across
 * serverless instances (an in-memory counter would be per instance).
 *
 * Returns true when the request is allowed. If the counter itself can't be
 * updated, the request is allowed and the error logged: a limiter outage
 * shouldn't take the site down with it.
 */
export const rateLimit = async (key: string, limit: number, windowSeconds: number) => {
    try {
        const rows = await db.$queryRaw<{ count: number }[]>`
            INSERT INTO "RateLimit" ("key", "count", "windowStart")
            VALUES (${key}, 1, NOW())
            ON CONFLICT ("key") DO UPDATE SET
                "count" = CASE
                    WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${windowSeconds}::double precision) THEN 1
                    ELSE "RateLimit"."count" + 1
                END,
                "windowStart" = CASE
                    WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${windowSeconds}::double precision) THEN NOW()
                    ELSE "RateLimit"."windowStart"
                END
            RETURNING "count"`;

        // Occasionally sweep counters from long-finished windows.
        if (Math.random() < 0.01) {
            await db.$executeRaw`DELETE FROM "RateLimit" WHERE "windowStart" < NOW() - INTERVAL '1 day'`;
        }

        return Number(rows[0]?.count ?? 0) <= limit;
    } catch (error) {
        console.error("RATE LIMIT ERROR", error);
        return true;
    }
};

/** Best-effort client address, for limiting anonymous endpoints. */
export const clientIp = async () => {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim()
        || h.get("x-real-ip")
        || "unknown";
};

export const tooManyRequests = (retryAfterSeconds: number) =>
    new NextResponse("Too many requests — please wait a moment and try again", {
        status : 429,
        headers : { "Retry-After" : String(retryAfterSeconds) },
    });
