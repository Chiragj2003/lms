"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Course } from "@/types";
import { MdOutlineShoppingCart, MdOutlineRemoveShoppingCart } from "react-icons/md";
import { cn } from "@/lib/utils";
import { toneFor } from "@/lib/tones";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/rating/stars";

interface CardWithRatingProps {
    className?: string;
    course: Course;
    isBestSeller?: boolean;
}

export const CardWithRating = ({
    className,
    course,
    isBestSeller
}: CardWithRatingProps ) => {

    const { items, toggleItem } = useCart();
    const session = useSession();
    const inCart = items.find(item=>item.id===course.id);
    const isTutor = session.data?.user.role === "TUTOR";

    return (
        <div
            className={cn(
                "group relative w-full flex flex-col bg-white rounded-[28px] p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
                className
            )}
        >
            <div className={cn("w-full aspect-video relative rounded-[22px] overflow-hidden", toneFor(course.id).bg)}>
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(min-width: 768px) 20rem, 18rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {
                    isBestSeller && (
                        <div className="absolute top-3 left-3 z-10">
                            <Badge variant="white">
                                Bestseller
                            </Badge>
                        </div>
                    )
                }
                
                {
                    !isTutor && (
                        <div className="absolute right-3 bottom-3 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-300">
                            <Button
                                variant="secondary"
                                size="icon"
                                className={cn(
                                    "h-11 w-11 rounded-full shadow-elevated transition-colors",
                                    inCart ? "bg-ink text-white hover:bg-ink-2" : "bg-white text-ink hover:bg-soft"
                                )}
                                aria-label={inCart ? `Remove ${course.title} from cart` : `Add ${course.title} to cart`}
                                onClick={(e)=>{
                                    e.preventDefault();
                                    toast.info(inCart ? "Course removed from cart" : "Course added to cart")
                                    toggleItem(course);
                                }}
                            >
                                { inCart ? <MdOutlineRemoveShoppingCart className="h-5 w-5"/> : <MdOutlineShoppingCart className="h-5 w-5"/> }
                            </Button>
                        </div>
                    )
                }
            </div>
            
            <div className="flex flex-col flex-1 px-2.5 pt-4 pb-2">
                <Link
                    href={`/course/${course.id}`}
                    className="outline-none after:absolute after:inset-0"
                >
                    <h3 className="font-medium text-ink line-clamp-2 text-lg leading-snug tracking-tight">
                        {course.title}
                    </h3>
                </Link>
                <p className="mt-1 text-sm text-ink-2 truncate">
                    {course.tutor_name}
                </p>
                
                <div className="flex items-center gap-x-2 mt-2">
                    <span className="text-sm font-semibold text-ink">{Number(course.average_rating || 0).toFixed(1)}</span>
                    <Stars avgRating={`${course.average_rating || 0}`} />
                    <span className="text-xs text-muted-foreground">({course.total_ratings ?? 0})</span>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-semibold text-xl text-ink">
                        {formatPrice(course.price)}
                    </span>
                    <span aria-hidden="true" className="size-9 rounded-full bg-ink text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="size-4" />
                    </span>
                </div>
            </div>
        </div>
    )
}
