"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

import { clerkAppearance } from "@/components/auth/clerk-appearance";


const LoginPage = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-display-sm">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Log in to continue your learning journey.
                </p>
            </div>
            <SignIn
                routing="hash"
                signUpUrl="/register"
                fallbackRedirectUrl="/user"
                appearance={clerkAppearance}
            />
            <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
                    Sign up
                </Link>
            </p>
        </div>
    )
}

export default LoginPage
