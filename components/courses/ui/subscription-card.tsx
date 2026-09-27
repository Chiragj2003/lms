"use client";

import Image from "next/image";
import { useState } from "react";

import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CouponCheckoutForm } from "@/components/checkout/coupon-checkout-form";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { Course } from "@prisma/client";


interface SubscriptionCardProps {
    courseId: string;
    poster: string;
    video?: string;
    price: number;
    title: string;
    course: Course
}

export const SubscriptionCard = ({
    courseId,
    poster,
    price,
    video,
    title,
    course
}: SubscriptionCardProps ) => {

    const [appliedPrice, setAppliedPrice] = useState(price);
    const { items, toggleItem } = useCart();
    const session = useSession();
    const isTutor = session.data?.user.role === "TUTOR";

    return (
        <div className="w-full h-fit shrink-0 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video w-full relative bg-muted">
                <Image
                    src={poster}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-6 md:p-8 w-full">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-3xl text-foreground font-bold" >{formatPrice(appliedPrice)}</h3>
                        {
                            !isTutor && (
                                <Button
                                    className="w-full h-12 text-base font-semibold"
                                    variant={items.find(item=>item.id===courseId) ? "secondary" : "default"}
                                    size="lg"
                                    // onClick={()=>toggleItem(course)}
                                >
                                    {
                                        items.find(item=>item.id===courseId) ? "Remove from cart" : "Add to cart"
                                    }
                                </Button>
                            )
                        }
                    </div>
                    {
                        isTutor ? (
                            <div className="p-4 rounded-xl bg-muted border border-border text-sm text-muted-foreground">
                                You&apos;re signed in as a tutor. Tutor accounts can browse and review courses, but cannot enrol in them.
                            </div>
                        ) : (
                            <>
                                <div className="relative flex items-center justify-center my-6">
                                    <div className="absolute h-px w-full bg-border" />
                                    <span className="text-xs z-10 bg-card px-2 font-medium text-muted-foreground uppercase tracking-wider">OR</span>
                                </div>
                                <CouponCheckoutForm
                                    courseId={courseId}
                                    price={appliedPrice}
                                    setPrice={(price:number)=>setAppliedPrice(price)}
                                    title={title}
                                    currentPrice={price}
                                />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
