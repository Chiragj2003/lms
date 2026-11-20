import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { MockPaymentForm } from "@/components/checkout/mock-payment-form";
import { isDemoCheckoutEnabled } from "@/lib/razorpay";

interface CheckoutPageProps {
    params : Promise<{ courseId : string }>;
    searchParams : Promise<{ amount?: string }>;
}

export const metadata = { title : "Checkout" };

const CheckoutPage = async ({ params, searchParams } : CheckoutPageProps) => {

    const { courseId } = await params;
    const { amount : amountParam } = await searchParams;

    // The demo page is only for the demo gateway.
    if (!isDemoCheckoutEnabled()) {
        return redirect(`/course/${courseId}`);
    }

    const session = await auth();
    if (!session) {
        return redirect("/login");
    }

    if (session.user.role === "TUTOR") {
        return redirect("/tutor/courses");
    }

    const course = await db.course.findUnique({
        where  : { id : courseId, isPublished : true },
        select : { id : true, title : true, shortDescription : true, image : true, price : true }
    });

    if (!course) {
        return redirect("/");
    }

    const alreadyOwned = await db.purchase.findUnique({
        where : { userId_courseId : { userId : session.user.id!, courseId : course.id } }
    });

    if (alreadyOwned) {
        return redirect(`/course/${course.id}/view`);
    }

    // Trust the course price, not the query string; the param is only a hint
    // carried over from the coupon calculation.
    const parsed = Number(amountParam);
    const amount = Number.isFinite(parsed) && parsed > 0 && parsed <= (course.price ?? 0)
        ? parsed
        : course.price ?? 0;

    return (
        <main className="min-h-screen bg-frame p-2 sm:p-4">
        <div className="min-h-[calc(100vh-2rem)] grid md:grid-cols-2 gap-2.5 rounded-[36px] bg-ink p-2.5">
            {/* Order summary */}
            <section className="rounded-[28px] bg-peri px-6 py-10 md:px-12 md:py-16 text-ink">
                <div className="max-w-md ml-auto w-full space-y-8">
                    <Link
                        href={`/course/${course.id}`}
                        className="inline-flex h-10 items-center rounded-full bg-white/60 px-4 text-sm font-medium text-ink hover:bg-white"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to course
                    </Link>

                    <div className="space-y-2">
                        <p className="text-sm text-ink-2">Enrol in course</p>
                        <p className="text-5xl font-semibold tracking-tight text-ink">{formatPrice(amount)}</p>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <div className="relative w-28 aspect-video rounded-2xl overflow-hidden shrink-0 bg-white/50">
                            {course.image && (
                                <Image src={course.image} alt="" fill sizes="7rem" className="object-cover" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground leading-snug">{course.title}</p>
                            <p className="text-sm text-ink-2 line-clamp-2">{course.shortDescription}</p>
                        </div>
                    </div>

                    <dl className="border-t border-ink/15 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-ink-2">
                            <dt>Subtotal</dt>
                            <dd>{formatPrice(course.price ?? 0)}</dd>
                        </div>
                        {amount !== (course.price ?? 0) && (
                            <div className="flex justify-between text-mint-deep">
                                <dt>Discount</dt>
                                <dd>-{formatPrice((course.price ?? 0) - amount)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-foreground border-t border-ink/15 pt-2">
                            <dt>Total due</dt>
                            <dd>{formatPrice(amount)}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Payment form */}
            <section className="rounded-[28px] bg-white px-6 py-10 md:px-12 md:py-16">
                <div className="max-w-md mr-auto w-full space-y-6">
                    <h1 className="text-display-sm">Pay with card</h1>
                    <MockPaymentForm
                        amount={amount}
                        confirmUrl={`/api/courses/${course.id}/checkout/confirm`}
                        successUrl={`/course/${course.id}/view`}
                    />
                </div>
            </section>
        </div>
        </main>
    );
};

export default CheckoutPage;
