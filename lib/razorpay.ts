import crypto from "crypto";
import Razorpay from "razorpay";

export const isRazorpayConfigured = () =>
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

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
