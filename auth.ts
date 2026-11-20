import "server-only";

import { cache } from "react";
import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

/**
 * Clerk signs people in; our database still owns everything else (role,
 * profile, purchases, progress). Each Clerk user is linked to one row in
 * `User` through an `Account` row with providerId "clerk", so the 44 server
 * files that call `await auth()` keep reading session.user.{id,role,profile}
 * exactly as before.
 *
 * A Clerk user whose email matches an existing account (from the old Google /
 * GitHub sign-in) is linked to that account, keeping their courses.
 */
export type AppSession = {
    user : {
        id : string;
        name : string | null;
        email : string;
        image : string | null;
        role : "LEARNER" | "TUTOR";
        profile : boolean;
    };
};

const CLERK = "clerk";

const userSelect = {
    id : true,
    name : true,
    email : true,
    image : true,
    role : true,
    profile : { select : { id : true } },
} as const;

type DbUser = {
    id : string;
    name : string | null;
    email : string;
    image : string | null;
    role : "LEARNER" | "TUTOR";
    profile : { id : string } | null;
};

const toSession = (user: DbUser): AppSession => ({
    user : { ...user, profile : !!user.profile },
});

/** First visit of a Clerk user: find or create their database user and link it. */
const linkClerkUser = async (clerkId: string): Promise<DbUser | null> => {
    const clerkUser = await currentUser();
    const email = (
        clerkUser?.primaryEmailAddress?.emailAddress ??
        clerkUser?.emailAddresses[0]?.emailAddress
    )?.toLowerCase();

    if (!clerkUser || !email) {
        return null;
    }

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || null;

    const user = await db.user.upsert({
        where : { email },
        update : {},
        create : {
            email,
            name,
            image : clerkUser.imageUrl ?? null,
            emailVerified : true,
        },
        select : userSelect,
    });

    await db.account.upsert({
        where : { providerId_accountId : { providerId : CLERK, accountId : clerkId } },
        update : { userId : user.id },
        create : { providerId : CLERK, accountId : clerkId, userId : user.id },
    });

    return user as DbUser;
};

/** The signed-in user, or null. Cached for the duration of one request. */
export const auth = cache(async (): Promise<AppSession | null> => {
    const { userId : clerkId } = await clerkAuth();
    if (!clerkId) {
        return null;
    }

    const account = await db.account.findUnique({
        where : { providerId_accountId : { providerId : CLERK, accountId : clerkId } },
        select : { user : { select : userSelect } },
    });

    const user = (account?.user as DbUser | undefined) ?? await linkClerkUser(clerkId);
    return user ? toSession(user) : null;
});
