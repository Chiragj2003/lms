import Link from "next/link";
import { Abril_Fatface } from "next/font/google";

const font = Abril_Fatface({
    subsets : ["latin"],
    weight : ["400"]
});

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
        <div className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="w-full max-w-md space-y-8 text-center">
                <h1 className={`${font.className} text-3xl md:text-4xl text-zinc-800`}>
                    We couldn&apos;t sign you in
                </h1>
                <p className="text-zinc-600">{message}</p>
                <Link
                    href="/login"
                    className="inline-block h-12 leading-[3rem] px-8 bg-neutral-800 text-white font-semibold"
                >
                    Back to login
                </Link>
            </div>
        </div>
    );
}
