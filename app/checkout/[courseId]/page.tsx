import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { MockPaymentForm } from "@/components/checkout/mock-payment-form";

interface CheckoutPageProps {
    params : Promise<{ courseId : string }>;
    searchParams : Promise<{ amount?: string }>;
}

export const metadata = { title : "Checkout" };

const CheckoutPage = async ({ params, searchParams } : CheckoutPageProps) => {

    const { courseId } = await params;
    const { amount : amountParam } = await searchParams;

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
        <main className="min-h-screen grid md:grid-cols-2">
            {/* Order summary */}
            <section className="bg-zinc-50 border-r border-zinc-200 px-6 py-10 md:px-12 md:py-16">
                <div className="max-w-md ml-auto w-full space-y-8">
                    <Link
                        href={`/course/${course.id}`}
                        className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to course
                    </Link>

                    <div className="space-y-2">
                        <p className="text-sm text-zinc-600">Enrol in course</p>
                        <p className="text-4xl font-semibold text-zinc-900">{formatPrice(amount)}</p>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 bg-zinc-200">
                            {course.image && (
                                <Image src={course.image} alt="" fill sizes="7rem" className="object-cover" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-zinc-900 leading-snug">{course.title}</p>
                            <p className="text-sm text-zinc-600 line-clamp-2">{course.shortDescription}</p>
                        </div>
                    </div>

                    <dl className="border-t border-zinc-200 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-zinc-600">
                            <dt>Subtotal</dt>
                            <dd>{formatPrice(course.price ?? 0)}</dd>
                        </div>
                        {amount !== (course.price ?? 0) && (
                            <div className="flex justify-between text-emerald-700">
                                <dt>Discount</dt>
                                <dd>-{formatPrice((course.price ?? 0) - amount)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-zinc-900 border-t border-zinc-200 pt-2">
                            <dt>Total due</dt>
                            <dd>{formatPrice(amount)}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Payment form */}
            <section className="px-6 py-10 md:px-12 md:py-16">
                <div className="max-w-md mr-auto w-full space-y-6">
                    <h1 className="text-xl font-semibold text-zinc-900">Pay with card</h1>
                    <MockPaymentForm
                        amount={amount}
                        confirmUrl={`/api/courses/${course.id}/checkout/confirm`}
                        successUrl={`/course/${course.id}/view`}
                    />
                </div>
            </section>
        </main>
    );
};

export default CheckoutPage;
