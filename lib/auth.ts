import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";

export const auth = betterAuth({
    // Reuses the existing AUTH_SECRET / NEXT_PUBLIC_APP_URL so no new keys are needed.
    secret : process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
    baseURL : process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,

    database : prismaAdapter(db, {
        provider : "postgresql"
    }),

    socialProviders : {
        google : {
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
        },
        github : {
            clientId : process.env.GITHUB_CLIENT_ID as string,
            clientSecret : process.env.GITHUB_CLIENT_SECRET as string
        }
    },

    account : {
        accountLinking : {
            // Replaces NextAuth's allowDangerousEmailAccountLinking. Scoped to
            // providers that verify email addresses, rather than allowing any.
            enabled : true,
            trustedProviders : ["google", "github"]
        }
    },

    user : {
        additionalFields : {
            role : {
                type : "string",
                required : false,
                defaultValue : "LEARNER",
                // Server-owned: a client must never be able to set its own role.
                input : false
            }
        }
    },

    plugins : [
        // `profile` is a relation rather than a column, so it can't be an
        // additionalField. Both role and profile are read in one query and
        // returned explicitly, which also keeps them in the inferred type the
        // client sees. Matches the shape the app already reads:
        // session.user.role / session.user.profile
        customSession(async ({ user, session }) => {
            const dbUser = await db.user.findUnique({
                where : { id : user.id },
                select : {
                    role : true,
                    profile : { select : { id : true } }
                }
            });

            return {
                session,
                user : {
                    ...user,
                    role : dbUser?.role ?? "LEARNER",
                    profile : !!dbUser?.profile
                }
            };
        }),
        // Must stay last: lets server actions set auth cookies.
        nextCookies()
    ]
});
