import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { NavigateProvider } from "@/providers/navigate.provider";
import { EdgeStoreProvider } from "@/providers/edgestore.provider";
import { ConfettiProvider } from "@/providers/confetti.provider";
import { ModalProvider } from "@/providers/modal.provider";
import { QueryProvider } from "@/providers/query.provider";

const inter = Inter({
    subsets: ["latin"],
    weight : ["400", "500", "600", "700"],
    display : "swap",
    variable: "--font-inter",
});


export const metadata: Metadata = {
    title: {
        default : "LearnIt — Learn a skill, prove it",
        template : "%s | LearnIt"
    },
    description: "Interactive courses with video chapters, quizzes and certificates. Learn at your own pace, or teach what you know.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth();

    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Better Auth's useSession fetches its own state, so no
                    session provider wrapper is needed. */}
                <QueryProvider>
                    <EdgeStoreProvider>
                        <Toaster
                            position="top-center"
                            richColors={true}
                            />
                        <NavigateProvider
                            session = { session }
                            />
                        <ConfettiProvider />
                        <ModalProvider />
                        {children}
                    </EdgeStoreProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
