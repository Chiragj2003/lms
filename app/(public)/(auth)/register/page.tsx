"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

import { clerkAppearance } from "@/components/auth/clerk-appearance";


const RegisterPage = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-display-sm">
                    Create your account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign up free and start learning — or teaching — today.
                </p>
            </div>
            <SignUp
                routing="hash"
                signInUrl="/login"
                fallbackRedirectUrl="/user"
                appearance={clerkAppearance}
            />
            <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
                    Log in
                </Link>
            </p>
        </div>
    )
}

export default RegisterPage
