"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";
import { payWithRazorpay } from "@/lib/razorpay-client";
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
        <PageContainer className="py-12 md:py-20 min-h-screen">
            <h1 className="text-3xl font-bold text-foreground mb-10" >Shopping Cart</h1>
            { items.length === 0 ? (
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
                    <div className="text-center">
                        <Button asChild>
                            <Link href="/search">Browse courses</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <ul className="lg:col-span-2 divide-y divide-border border border-border rounded-2xl bg-card">
                        {
                            items.map((item)=>(
                                <li key={item.id} className="flex gap-4 p-4">
                                    <Link
                                        href={`/course/${item.id}`}
                                        className="relative w-32 md:w-40 aspect-video rounded-lg overflow-hidden bg-muted shrink-0"
                                    >
                                        {item.image && (
                                            <Image src={item.image} alt={item.title} fill sizes="10rem" className="object-cover" />
                                        )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/course/${item.id}`} className="font-semibold text-foreground line-clamp-2 hover:text-primary">
                                            {item.title}
                                        </Link>
                                        {item.tutor_name && (
                                            <p className="text-sm text-muted-foreground mt-1 truncate">{item.tutor_name}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground"
                                            onClick={()=>toggleItem(item)}
                                            aria-label={`Remove ${item.title} from cart`}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <aside className="border border-border rounded-2xl bg-card p-6 space-y-4 lg:sticky lg:top-24">
                        <h2 className="text-lg font-semibold text-foreground">Order summary</h2>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <dt>{items.length} {items.length === 1 ? "course" : "courses"}</dt>
                                <dd>{formatPrice(total)}</dd>
                            </div>
                            <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2 text-base">
                                <dt>Total</dt>
                                <dd>{formatPrice(total)}</dd>
                            </div>
                        </dl>
                        <Button
                            size="lg"
                            className="w-full h-12 text-base font-semibold"
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
