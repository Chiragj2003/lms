"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { OauthButton } from "@/components/auth/oauth-btn";


const RegisterPage = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Create your account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign up free and start learning — or teaching — today.
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <OauthButton
                    title="Sign up with Google"
                    provider="google"
                    Icon={FcGoogle}
                    redirect="/user"
                />
                <OauthButton
                    title="Sign up with GitHub"
                    provider="github"
                    Icon={FaGithub}
                    redirect="/user"
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                    Log in
                </Link>
            </p>
        </div>
    )
}

export default RegisterPage
