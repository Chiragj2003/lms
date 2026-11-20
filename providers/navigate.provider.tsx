"use client";

import { useRouter } from "next/navigation";

import type { AppSession } from "@/auth";

interface NavigateProviderProps {
    session : AppSession | null
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
