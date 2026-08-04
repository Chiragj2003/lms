import { headers } from "next/headers";

import { auth as betterAuth } from "@/lib/auth";

/**
 * Compatibility shim for the `await auth()` call the app already makes in 44
 * server files. Better Auth returns { session, user } and those files read
 * session.user.{id,role,profile}, so the shape lines up as-is.
 */
export const auth = async () => {
    return betterAuth.api.getSession({
        headers : await headers()
    });
};
