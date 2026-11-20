"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

import type { AppSession } from "@/auth";

const fetchSession = async (url: string): Promise<AppSession | null> => {
    const res = await fetch(url, { cache : "no-store" });
    return res.ok ? res.json() : null;
};

/**
 * Same shape the components already read ({ data, isPending }), backed by
 * Clerk. Clerk says whether someone is signed in; /api/me adds the database
 * id, role and profile flag.
 */
export const useSession = () => {
    const { isLoaded, userId } = useAuth();
    const { data, isLoading } = useSWR(userId ? ["/api/me", userId] : null, ([url]) => fetchSession(url));

    return {
        data : userId ? data ?? null : null,
        isPending : !isLoaded || (!!userId && isLoading),
    };
};
