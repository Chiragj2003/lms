"use client"

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Course } from "@prisma/client";
import { MdOutlineShoppingCart, MdOutlineRemoveShoppingCart } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { X } from "lucide-react";

interface CardProps {
    course : (Course );
    isBestSeller? : boolean;
    className? : string;
    remove?: boolean;
}

export const Card = ({
    course,
    isBestSeller,
    className,
    remove
} : CardProps ) => {

    const { items, toggleItem } = useCart();
    const session = useSession();
    const inCart = items.find(item=>item.id===course.id);
    // Tutors browse the catalogue but never buy from it.
    const isTutor = session.data?.user.role === "TUTOR";

    return (
        <div
            className={cn(
                // The card is a link region: the title carries the real anchor and
                // stretches over the card, so it stays keyboard-reachable.
                "group relative w-72 md:w-80 space-y-6 p-3 pb-6 bg-card border rounded-xl shadow-sm",
                "transition-shadow duration-200 hover:shadow-lg",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        >
            <div className="w-full aspect-video rounded-lg overflow-hidden relative bg-zinc-100">
                <Image
                    src={course.image!}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 20rem, 18rem"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {
                    isBestSeller && (
                        <span className="absolute left-3 top-3 z-10 px-2 py-1 bg-highlight-500 text-highlight-foreground text-xs font-semibold rounded-full shadow-sm">
                            Bestseller
                        </span>
                    )
                }
                {
                    remove ? (
                        <div className="absolute right-3 top-3 z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white hover:bg-white"
                                aria-label={`Remove ${course.title} from cart`}
                                onClick={()=>{
                                    // toggleItem(course);
                                    toast.info("Course is removed from cart");
                                }}
                            >
                                <X className="text-zinc-800 h-5 w-5" />
                            </Button>
                        </div>
                    ) : isTutor ? null : (
                        <div className={cn(
                            // Fades in on hover, but stays reachable on keyboard focus.
                            "absolute right-4 bottom-4 z-10 transition-opacity duration-200",
                            "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
                        )}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white hover:bg-white"
                                aria-label={inCart ? `Remove ${course.title} from cart` : `Add ${course.title} to cart`}
                                onClick={()=>{
                                    toast.info(inCart ? "Course is removed from cart" : "Course is added to cart")
                                    // toggleItem(course);
                                }}
                            >
                                { inCart ? (<MdOutlineRemoveShoppingCart className="text-zinc-800 h-6 w-6"/>): (<MdOutlineShoppingCart className="text-zinc-800 h-6 w-6"/>)}
                            </Button>
                        </div>
                    )
                }
            </div>
            <div className="w-full space-y-3 px-3">
                <h2 className="font-semibold text-zinc-800 line-clamp-2 text-base">
                    <Link
                        href={`/course/${course.id}`}
                        className="outline-none after:absolute after:inset-0 after:rounded-xl"
                    >
                        {course.title}
                    </Link>
                </h2>
                <p className="font-semibold text-zinc-900">
                    {formatPrice(course.price!)}
                </p>
            </div>
        </div>
    )
}
