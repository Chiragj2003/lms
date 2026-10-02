import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

import { auth } from '@/auth';
import { edgeStoreRouter, type Context } from '@/lib/edgestore-router';

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    // Signed-out visitors still get a context — the provider initialises on
    // every page — they just can't upload anything.
    createContext: async (): Promise<Context> => {
        const session = await auth();
        if (!session?.user?.id) {
            return { userId : "anonymous", role : "ANONYMOUS" };
        }
        return {
            userId : session.user.id,
            role : session.user.role === "TUTOR" ? "TUTOR" : "LEARNER",
        };
    },
});

export { handler as GET, handler as POST };
export type { EdgeStoreRouter } from '@/lib/edgestore-router';
