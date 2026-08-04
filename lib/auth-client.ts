import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
    baseURL : process.env.NEXT_PUBLIC_APP_URL,
    // Carries the server's customSession shape (role, profile) through to
    // useSession() on the client, fully typed.
    plugins : [customSessionClient<typeof auth>()]
});

export const {
    signIn,
    signOut,
    useSession
} = authClient;
