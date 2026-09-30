import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";

import { Header } from "@/components/utils/header";
import { Footer } from "@/components/utils/footer";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header variant="default" />
            <main className="flex-1">
                <PageContainer className="py-20 md:py-32">
                    <div className="max-w-xl mx-auto text-center space-y-6">
                        <div className="relative h-48 aspect-square mx-auto opacity-80">
                            <Image
                                src="/assets/empty.jpg"
                                fill
                                alt=""
                                className="object-contain"
                            />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                404 — Page not found
                            </h1>
                            <p className="text-muted-foreground">
                                The page you&apos;re looking for doesn&apos;t exist or may have moved.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button asChild size="lg">
                                <Link href="/">Back to home</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/search">
                                    <Compass className="h-4 w-4 mr-2" />
                                    Browse courses
                                </Link>
                            </Button>
                        </div>
                    </div>
                </PageContainer>
            </main>
            <Footer />
        </div>
    );
}
