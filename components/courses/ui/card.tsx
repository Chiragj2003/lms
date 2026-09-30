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
import { Badge } from "@/components/ui/badge";

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
    const isTutor = session.data?.user.role === "TUTOR";

    // This card only ever sees a bare Course row (no rating/purchase
    // aggregates attached), so the cart entry is built with safe defaults for
    // the fields the cart card displays.
    const toggleCartItem = () => toggleItem({
        id : course.id,
        title : course.title,
        price : course.price ?? 0,
        image : course.image ?? "",
        total_purchases : 0,
        total_ratings : 0,
        average_rating : "0",
        tutor_name : ""
    });

    return (
        <div
            className={cn(
                "group relative w-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50",
                className
            )}
        >
            <div className="w-full aspect-video relative bg-muted overflow-hidden">
                <Image
                    src={course.image!}
                    alt={course.title}
                    fill
                    sizes="(min-width: 768px) 20rem, 18rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {
                    isBestSeller && (
                        <div className="absolute top-3 left-3 z-10">
                            <Badge variant="highlight" className="shadow-sm">
                                Bestseller
                            </Badge>
                        </div>
                    )
                }
                {
                    remove ? (
                        <div className="absolute right-3 top-3 z-10">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                aria-label={`Remove ${course.title} from cart`}
                                onClick={(e)=>{
                                    e.preventDefault();
                                    toggleCartItem();
                                    toast.info("Course removed from cart");
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : !isTutor && (
                        <div className="absolute right-3 bottom-3 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-300">
                            <Button
                                variant="secondary"
                                size="icon"
                                className={cn(
                                    "h-10 w-10 rounded-full shadow-md transition-colors",
                                    inCart ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-zinc-900 hover:bg-zinc-100"
                                )}
                                aria-label={inCart ? `Remove ${course.title} from cart` : `Add ${course.title} to cart`}
                                onClick={(e)=>{
                                    e.preventDefault();
                                    toast.info(inCart ? "Course removed from cart" : "Course added to cart")
                                    toggleCartItem();
                                }}
                            >
                                { inCart ? <MdOutlineRemoveShoppingCart className="h-5 w-5"/> : <MdOutlineShoppingCart className="h-5 w-5"/> }
                            </Button>
                        </div>
                    )
                }
            </div>
            
            <div className="flex flex-col flex-1 p-4 md:p-5">
                <Link
                    href={`/course/${course.id}`}
                    className="outline-none after:absolute after:inset-0"
                >
                    <h3 className="font-semibold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                </Link>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">
                        {formatPrice(course.price!)}
                    </span>
                </div>
            </div>
        </div>
    )
}
