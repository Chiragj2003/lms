import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { getCartCourseIds } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { isRazorpayConfigured } from "@/lib/razorpay";
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

    // With real payments configured the cart page opens Razorpay directly.
    if (isRazorpayConfigured()) {
        return redirect("/cart");
    }

    const courses = await getCourseCardsByIds(await getCartCourseIds(session.user.id!));
    if (courses.length === 0) {
        return redirect("/cart");
    }

    const total = courses.reduce((sum, course) => sum + (course.price || 0), 0);

    return (
        <main className="min-h-screen grid md:grid-cols-2">
            {/* Order summary */}
            <section className="bg-muted border-r border-border px-6 py-10 md:px-12 md:py-16">
                <div className="max-w-md ml-auto w-full space-y-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to cart
                    </Link>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Enrol in {courses.length} {courses.length === 1 ? "course" : "courses"}
                        </p>
                        <p className="text-4xl font-semibold text-foreground">{formatPrice(total)}</p>
                    </div>

                    <ul className="space-y-4 pt-2">
                        {courses.map((course) => (
                            <li key={course.id} className="flex gap-4">
                                <div className="relative w-24 aspect-video rounded-md overflow-hidden shrink-0 bg-muted">
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

                    <dl className="border-t border-border pt-4 text-sm">
                        <div className="flex justify-between font-semibold text-foreground">
                            <dt>Total due</dt>
                            <dd>{formatPrice(total)}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Payment form */}
            <section className="px-6 py-10 md:px-12 md:py-16">
                <div className="max-w-md mr-auto w-full space-y-6">
                    <h1 className="text-xl font-semibold text-foreground">Pay with card</h1>
                    <CartMockPaymentForm amount={total} />
                </div>
            </section>
        </main>
    );
};

export default CartCheckoutPage;
