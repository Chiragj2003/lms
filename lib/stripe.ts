import Stripe from "stripe";

let client : Stripe | null = null;

/**
 * Built on first use rather than at import time. Constructing eagerly meant a
 * missing STRIPE_API_KEY threw while Next collected page data, which failed the
 * whole build instead of just the payment routes.
 */
export const getStripe = () => {
    if (!process.env.STRIPE_API_KEY) {
        throw new Error("STRIPE_API_KEY is not set — add it to .env (see .env.example)");
    }

    if (!client) {
        client = new Stripe(process.env.STRIPE_API_KEY, {
            apiVersion : "2026-06-24.dahlia",
            typescript : true
        });
    }

    return client;
};
