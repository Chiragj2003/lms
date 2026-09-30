import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";

// No baseURL: the client talks to /api/auth on whatever origin served the
// page. Pinning it to NEXT_PUBLIC_APP_URL broke sign-in whenever the app ran
// anywhere else (another local port, a preview deployment).
export const authClient = createAuthClient({
    // Carries the server's customSession shape (role, profile) through to
    // useSession() on the client, fully typed.
    plugins : [customSessionClient<typeof auth>()]
});

export const {
    signIn,
    signOut,
    useSession
} = authClient;
