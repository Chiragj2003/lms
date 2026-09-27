"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardWithRating } from "@/components/courses/ui/card-with-ratings";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/ui/page-container";


const CartPage = () => {

    const { items } = useCart();
    const session = useSession();
    const router = useRouter();
    const isTutor = session.data?.user.role === "TUTOR";

    // Tutors have no cart; reaching this URL directly sends them back.
    useEffect(()=>{
        if (isTutor) router.replace("/tutor/courses");
    }, [isTutor, router]);

    return (
        <PageContainer className="py-12 md:py-20 min-h-screen">
            <h1 className="text-3xl font-bold text-foreground mb-10" >Shopping Cart</h1>
            { items.length === 0 && (
                <div className="mt-20 space-y-6">
                    <div className="w-40 aspect-square mx-auto relative opacity-80">
                        <Image
                            src="/assets/bag.png"
                            fill
                            alt=""
                            className="object-contain"
                        />
                    </div>
                    <p className="text-base text-muted-foreground font-medium text-center">
                        Your cart is empty. Keep shopping to find a course!
                    </p>
                </div>
            ) }
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {
                    items.map((item)=>(
                        <CardWithRating
                            course={item}
                            key={item.id}
                            className="w-full md:w-full md:hover:scale-105 transition-all duration-300"
                        />
                    ))
                }
            </section>
        </PageContainer>
    )
}

export default CartPage;
