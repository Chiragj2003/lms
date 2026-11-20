"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CouponCheckoutForm } from "@/components/checkout/coupon-checkout-form";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { toneFor } from "@/lib/tones";


interface SubscriptionCardProps {
    courseId: string;
    poster: string;
    video?: string;
    price: number;
    title: string;
    course: Course;
    avgRating: number;
    totalRatings: number;
    totalPurchases: number;
    tutorName: string;
    isPurchased: boolean;
}

export const SubscriptionCard = ({
    courseId,
    poster,
    price,
    video,
    title,
    course,
    avgRating,
    totalRatings,
    totalPurchases,
    tutorName,
    isPurchased
}: SubscriptionCardProps ) => {

    const [appliedPrice, setAppliedPrice] = useState(price);
    const { items, toggleItem } = useCart();
    const session = useSession();
    const isTutor = session.data?.user.role === "TUTOR";

    const toggleCartItem = () => toggleItem({
        id : courseId,
        title,
        price : course.price ?? price,
        image : course.image ?? poster,
        total_purchases : totalPurchases,
        total_ratings : totalRatings,
        average_rating : String(avgRating || 0),
        tutor_name : tutorName
    });

    return (
        <div className="w-full h-fit shrink-0 bg-white rounded-[32px] p-2.5 shadow-float">
            <div className={cn("aspect-video w-full relative rounded-[24px] overflow-hidden", toneFor(courseId).bg)}>
                <Image
                    src={poster}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="px-4 pt-5 pb-4 w-full">
                {
                    isPurchased ? (
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-foreground">
                                You own this course — you have lifetime access.
                            </p>
                            <Button asChild size="lg" className="w-full">
                                <Link href={`/course/${courseId}/view`}>Go to course</Link>
                            </Button>
                        </div>
                    ) : (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-[40px] leading-none text-ink font-semibold tracking-tight">{formatPrice(appliedPrice)}</p>
                        {
                            !isTutor && (
                                <Button
                                    className="w-full"
                                    variant={items.find(item=>item.id===courseId) ? "outline" : "default"}
                                    size="lg"
                                    onClick={toggleCartItem}
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
                            <div className="p-4 rounded-2xl bg-peri-soft text-sm text-ink-2">
                                You&apos;re signed in as a tutor. Tutor accounts can browse and review courses, but cannot enrol in them.
                            </div>
                        ) : (
                            <>
                                <div className="relative flex items-center justify-center my-6">
                                    <div className="absolute h-px w-full bg-border" />
                                    <span className="text-xs z-10 bg-white px-3 font-medium text-muted-foreground uppercase tracking-wider">or buy now</span>
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
                    )
                }
            </div>
        </div>
    )
}
