import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { getCartCourseIds } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { isDemoCheckoutEnabled } from "@/lib/razorpay";
import { getCourseCardsByIds } from "@/server/course";
import { CartMockPaymentForm } from "@/components/checkout/cart-mock-payment-form";

export const metadata = { title : "Checkout" };

const CartCheckoutPage = async () => {

    const session = await auth();
    if (!session) {
        return redirect("/login");
    }

    if (session.user.role === "TUTOR") {
        return redirect("/tutor/courses");
    }

    // The demo page is only for the demo gateway; with real payments the
    // cart page opens Razorpay directly.
    if (!isDemoCheckoutEnabled()) {
        return redirect("/cart");
    }

    const courses = await getCourseCardsByIds(await getCartCourseIds(session.user.id!));
    if (courses.length === 0) {
        return redirect("/cart");
    }

    const total = courses.reduce((sum, course) => sum + (course.price || 0), 0);

    return (
        <main className="min-h-screen bg-frame p-2 sm:p-4">
        <div className="min-h-[calc(100vh-2rem)] grid md:grid-cols-2 gap-2.5 rounded-[36px] bg-ink p-2.5">
            {/* Order summary */}
            <section className="rounded-[28px] bg-peri px-6 py-10 md:px-12 md:py-16 text-ink">
                <div className="max-w-md ml-auto w-full space-y-8">
                    <Link
                        href="/cart"
                        className="inline-flex h-10 items-center rounded-full bg-white/60 px-4 text-sm font-medium text-ink hover:bg-white"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to cart
                    </Link>

                    <div className="space-y-2">
                        <p className="text-sm text-ink-2">
                            Enrol in {courses.length} {courses.length === 1 ? "course" : "courses"}
                        </p>
                        <p className="text-5xl font-semibold tracking-tight text-ink">{formatPrice(total)}</p>
                    </div>

                    <ul className="space-y-4 pt-2">
                        {courses.map((course) => (
                            <li key={course.id} className="flex gap-4">
                                <div className="relative w-24 aspect-video rounded-2xl overflow-hidden shrink-0 bg-white/50">
                                    {course.image && (
                                        <Image src={course.image} alt="" fill sizes="6rem" className="object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground leading-snug line-clamp-2">{course.title}</p>
                                </div>
                                <p className="text-sm text-foreground">{formatPrice(course.price)}</p>
                            </li>
                        ))}
                    </ul>

                    <dl className="border-t border-ink/15 pt-4 text-sm">
                        <div className="flex justify-between font-semibold text-foreground">
                            <dt>Total due</dt>
                            <dd>{formatPrice(total)}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Payment form */}
            <section className="rounded-[28px] bg-white px-6 py-10 md:px-12 md:py-16">
                <div className="max-w-md mr-auto w-full space-y-6">
                    <h1 className="text-display-sm">Pay with card</h1>
                    <CartMockPaymentForm amount={total} />
                </div>
            </section>
        </div>
        </main>
    );
};

export default CartCheckoutPage;
