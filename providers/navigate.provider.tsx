"use client";

import { useRouter } from "next/navigation";

import type { auth } from "@/lib/auth";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

interface NavigateProviderProps {
    session : Session
}

export const NavigateProvider = ({
    session
}:NavigateProviderProps) => {

    const router = useRouter();

    if (session && !session.user.profile ) {
        router.push("/user");
    }

    return null;
}
