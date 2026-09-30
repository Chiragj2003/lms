"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { OauthButton } from "@/components/auth/oauth-btn";


const LoginPage = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Log in to continue your learning journey.
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <OauthButton
                    title="Continue with Google"
                    provider="google"
                    Icon={FcGoogle}
                    redirect="/"
                />
                <OauthButton
                    title="Continue with GitHub"
                    provider="github"
                    Icon={FaGithub}
                    redirect="/"
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                    Sign up
                </Link>
            </p>
        </div>
    )
}

export default LoginPage
