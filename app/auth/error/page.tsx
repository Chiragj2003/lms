import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

// Better Auth redirects here (pages.error) with ?error=<code> when sign-in
// fails. Previously this route 404'd, so failures looked like a broken app.
const MESSAGES : Record<string, string> = {
    access_denied : "You cancelled the sign-in, or access wasn't granted.",
    OAuthAccountNotLinked : "That email is already registered with a different provider.",
    Configuration : "Sign-in is misconfigured. Please try again shortly."
};

export default async function AuthErrorPage(
    { searchParams } : { searchParams : Promise<{ error?: string }> }
) {
    const { error } = await searchParams;
    const message = (error && MESSAGES[error]) || "Something went wrong while signing you in.";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md text-center space-y-6 bg-white rounded-[40px] p-10">
                <div className="mx-auto size-20 rounded-full bg-[#FDE4E1] text-destructive flex items-center justify-center">
                    <AlertCircle className="size-8" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-display-sm">
                        We couldn&apos;t sign you in
                    </h1>
                    <p className="text-muted-foreground">{message}</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/login">Back to login</Link>
                </Button>
            </div>
        </div>
    );
}
