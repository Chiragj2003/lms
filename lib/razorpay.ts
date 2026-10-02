import crypto from "crypto";
import Razorpay from "razorpay";

export const isRazorpayConfigured = () =>
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

/**
 * The demo gateway enrolls learners without charging them. It used to switch
 * on whenever the Razorpay keys were missing, so a deployment without keys
 * gave every paid course away. Now it also needs an explicit opt-in, meant
 * for local development and demos only.
 */
export const isDemoCheckoutEnabled = () =>
    !isRazorpayConfigured() && process.env.DEMO_CHECKOUT === "true";

/** Neither real payments nor the demo gateway is available. */
export const PAYMENTS_UNAVAILABLE = "Payments aren't set up yet. Please try again later.";

export const getRazorpay = () => new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID!,
    key_secret : process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Proves Razorpay completed a payment for this order. It does NOT prove what
 * the order was for — callers must also fetch the order and check its notes.
 */
export const isValidPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
    const expected = Buffer.from(
        crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${orderId}|${paymentId}`)
            .digest("hex")
    );
    const received = Buffer.from(String(signature));
    return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};
