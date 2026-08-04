/**
 * Restores auth data into the Better Auth schema shape.
 *
 * Run AFTER `npx prisma db push`, which rewrites Account/Session/Verification
 * and flips User.emailVerified from DateTime? to Boolean.
 *
 * Reads .backup/auth-backup.json (taken before the schema change) and:
 *   - re-inserts the OAuth accounts in Better Auth's column layout
 *   - marks users who previously had an emailVerified date as verified
 *
 * Safe to run more than once: accounts are upserted on (providerId, accountId).
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const backup = JSON.parse(readFileSync(".backup/auth-backup.json", "utf8"));

const run = async () => {
    console.log(`backup taken at ${backup.takenAt}`);
    console.log(`restoring ${backup.accounts.length} accounts for ${backup.users.length} users\n`);

    let verified = 0;
    for (const user of backup.users) {
        if (user.emailVerified) {
            await db.user.update({
                where : { id : user.id },
                data  : { emailVerified : true }
            });
            verified++;
        }
    }
    console.log(`users marked email-verified: ${verified}`);

    let restored = 0;
    for (const account of backup.accounts) {
        const data = {
            accountId  : account.providerAccountId,
            providerId : account.provider,
            userId     : account.userId,
            accessToken  : account.access_token ?? null,
            refreshToken : account.refresh_token ?? null,
            idToken      : account.id_token ?? null,
            // NextAuth stored expiry as unix seconds; Better Auth wants a Date.
            accessTokenExpiresAt : account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
            scope : account.scope ?? null
        };

        await db.account.upsert({
            where  : {
                providerId_accountId : {
                    providerId : data.providerId,
                    accountId  : data.accountId
                }
            },
            update : data,
            create : { id : randomUUID(), ...data }
        });
        restored++;
    }
    console.log(`accounts restored: ${restored}`);

    const [users, accounts] = await Promise.all([
        db.user.count(),
        db.account.count()
    ]);
    console.log(`\nfinal state -> users: ${users}, accounts: ${accounts}`);
};

run()
    .catch((error) => {
        console.error("migration failed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
