"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";
import { payWithRazorpay } from "@/lib/razorpay-client";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { toneFor } from "@/lib/tones";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";


const CartPage = () => {

    const { items, toggleItem } = useCart();
    const session = useSession();
    const router = useRouter();
    const [checkingOut, setCheckingOut] = useState(false);
    const isTutor = session.data?.user.role === "TUTOR";

    // Tutors have no cart; reaching this URL directly sends them back.
    useEffect(()=>{
        if (isTutor) router.replace("/tutor/courses");
    }, [isTutor, router]);

    const total = items.reduce((sum, item)=>sum + (item.price || 0), 0);

    const onCheckout = async()=>{
        if (!session.data) {
            router.push("/login");
            return;
        }

        try {
            setCheckingOut(true);
            const { data } = await axios.post("/api/cart/checkout");

            // Demo gateway, or a cart that was entirely free.
            if (data.url) {
                router.push(data.url);
                router.refresh();
                return;
            }

            const next = await payWithRazorpay(data, "/api/cart/verify");
            if (next) {
                useCart.getState().clear();
                toast.success("Payment successful. You're enrolled.");
                router.push(next);
                router.refresh();
            }
        } catch (error) {
            toast.error(axios.isAxiosError(error) && typeof error.response?.data === "string"
                ? error.response.data
                : "Checkout could not be completed");
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <PageContainer className="py-8 md:py-12 min-h-[70vh]">
            <div className="mb-8 flex flex-wrap items-baseline gap-3">
                <h1 className="text-display-sm">Your cart</h1>
                {items.length > 0 && (
                    <span className="inline-flex h-8 items-center rounded-full bg-white px-4 text-sm font-medium">
                        {items.length} {items.length === 1 ? "course" : "courses"}
                    </span>
                )}
            </div>
            { items.length === 0 ? (
                <EmptyState
                    className="rounded-[32px] bg-white py-16"
                    illustration="/assets/illustrations/empty-cart.webp"
                    title="Your cart is empty"
                    description="Add a course or two and check out together."
                    action={
                        <Button asChild>
                            <Link href="/search">Browse courses</Link>
                        </Button>
                    }
                />
            ) : (
                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    <ul className="lg:col-span-2 space-y-3">
                        {
                            items.map((item)=>(
                                <li key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 rounded-[28px] bg-white p-2.5 pr-4">
                                    <Link
                                        href={`/course/${item.id}`}
                                        className={cn("relative w-36 md:w-44 aspect-video rounded-[22px] overflow-hidden shrink-0", toneFor(item.id).bg)}
                                    >
                                        {item.image && (
                                            <Image src={item.image} alt={item.title} fill sizes="10rem" className="object-cover" />
                                        )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/course/${item.id}`} className="text-lg font-medium tracking-tight text-ink line-clamp-2 hover:underline underline-offset-4">
                                            {item.title}
                                        </Link>
                                        {item.tutor_name && (
                                            <p className="text-sm text-muted-foreground mt-1 truncate">{item.tutor_name}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 ml-auto">
                                        <span className="text-xl font-semibold text-ink">{formatPrice(item.price)}</span>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={()=>toggleItem(item)}
                                            aria-label={`Remove ${item.title} from cart`}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <aside className="rounded-[32px] bg-white p-6 space-y-4 shadow-float lg:sticky lg:top-24">
                        <h2 className="text-xl font-medium tracking-tight text-ink">Order summary</h2>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <dt>{items.length} {items.length === 1 ? "course" : "courses"}</dt>
                                <dd>{formatPrice(total)}</dd>
                            </div>
                            <div className="flex items-baseline justify-between text-ink border-t border-border pt-4 text-base font-medium [&>dd]:text-[32px] [&>dd]:font-semibold [&>dd]:tracking-tight">
                                <dt>Total</dt>
                                <dd>{formatPrice(total)}</dd>
                            </div>
                        </dl>
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={onCheckout}
                            disabled={checkingOut}
                        >
                            {checkingOut ? "Processing…" : session.data ? "Checkout" : "Sign in to check out"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Coupons can be applied from a course&apos;s own page.
                        </p>
                    </aside>
                </div>
            )}
        </PageContainer>
    )
}

export default CartPage;
