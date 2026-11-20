import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { NavigateProvider } from "@/providers/navigate.provider";
import { EdgeStoreProvider } from "@/providers/edgestore.provider";
import { ConfettiProvider } from "@/providers/confetti.provider";
import { ModalProvider } from "@/providers/modal.provider";
import { QueryProvider } from "@/providers/query.provider";
import { CartSync } from "@/components/utils/cart-sync";

const outfit = Outfit({
    subsets: ["latin"],
    weight : ["300", "400", "500", "600", "700"],
    display : "swap",
    variable: "--font-outfit",
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
            <body className={`${outfit.variable} font-sans antialiased`}>
                <ClerkProvider signInUrl="/login" signUpUrl="/register">
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
                        <CartSync />
                        {children}
                    </EdgeStoreProvider>
                </QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
