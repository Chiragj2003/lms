"use client";

import axios from "axios";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loading: Promise<boolean> | null = null;

/** Loads Razorpay's checkout script once per page, however often it's called. */
export const loadRazorpay = () => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
        return Promise.resolve(true);
    }

    if (!loading) {
        loading = new Promise<boolean>((resolve) => {
            const script = document.createElement("script");
            script.src = SCRIPT_SRC;
            script.onload = () => resolve(true);
            script.onerror = () => {
                // Let a later attempt retry instead of caching the failure.
                loading = null;
                script.remove();
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    return loading;
};

export interface RazorpayOrder {
    orderId : string;
    amount : number;
    currency : string;
    courseName : string;
    courseDescription : string;
    tutorName? : string | null;
    tutorEmail? : string | null;
    keyId : string;
}

/**
 * Opens Razorpay for an order our server created, then posts the result to
 * `verifyUrl`. Resolves with the URL the server says to go to next.
 */
export const payWithRazorpay = async (order: RazorpayOrder, verifyUrl: string) => {
    if (!(await loadRazorpay())) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
    }

    return new Promise<string | undefined>((resolve, reject) => {
        const checkout = new (window as any).Razorpay({
            key : order.keyId,
            amount : order.amount,
            currency : order.currency,
            name : order.courseName,
            description : order.courseDescription,
            order_id : order.orderId,
            prefill : {
                name : order.tutorName || "",
                email : order.tutorEmail || "",
            },
            theme : { color : "#0f172a" },
            handler : async (response: any) => {
                try {
                    const verified = await axios.post(verifyUrl, {
                        razorpay_payment_id : response.razorpay_payment_id,
                        razorpay_order_id : response.razorpay_order_id,
                        razorpay_signature : response.razorpay_signature,
                    });
                    resolve(verified.data.url);
                } catch (error) {
                    reject(error);
                }
            },
            modal : { ondismiss : () => resolve(undefined) },
        });
        checkout.open();
    });
};
