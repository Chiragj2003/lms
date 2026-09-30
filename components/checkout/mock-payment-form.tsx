"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Lock } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface MockPaymentFormProps {
    amount : number;
    // Endpoint that grants the purchase, and where to go once it has.
    confirmUrl : string;
    successUrl : string;
    onSuccess? : ()=>void;
}

// Prefilled so the flow can be demonstrated without typing anything. These are
// Stripe's published test values, not real card details.
const DEFAULTS = {
    email : "demo.learner@example.com",
    card : "4242 4242 4242 4242",
    expiry : "12 / 34",
    cvc : "123",
    name : "Demo Learner",
    zip : "560001"
};

export const MockPaymentForm = ({ amount, confirmUrl, successUrl, onSuccess } : MockPaymentFormProps) => {

    const router = useRouter();
    const [values, setValues] = useState(DEFAULTS);
    const [paying, setPaying] = useState(false);

    const set = (key : keyof typeof DEFAULTS) => (e : React.ChangeEvent<HTMLInputElement>) =>
        setValues((prev) => ({ ...prev, [key] : e.target.value }));

    const onPay = async (e : React.FormEvent) => {
        e.preventDefault();
        setPaying(true);

        try {
            await axios.post(confirmUrl);
            onSuccess?.();
            toast.success("Payment successful. You're enrolled.");
            router.push(successUrl);
            router.refresh();
        } catch {
            toast.error("Payment could not be completed");
            setPaying(false);
        }
    };

    const field = "w-full h-11 px-3 border border-input bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
    const label = "text-sm font-medium text-foreground";

    return (
        <form onSubmit={onPay} className="space-y-5">
            <div className="space-y-1.5">
                <label htmlFor="email" className={label}>Email</label>
                <input id="email" type="email" value={values.email} onChange={set("email")} className={field} required />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="card" className={label}>Card information</label>
                <input
                    id="card"
                    value={values.card}
                    onChange={set("card")}
                    className={`${field} rounded-b-none`}
                    inputMode="numeric"
                    required
                />
                <div className="flex -mt-1.5">
                    <input
                        aria-label="Expiry date"
                        value={values.expiry}
                        onChange={set("expiry")}
                        className={`${field} rounded-t-none rounded-r-none border-r-0`}
                        required
                    />
                    <input
                        aria-label="CVC"
                        value={values.cvc}
                        onChange={set("cvc")}
                        className={`${field} rounded-t-none rounded-l-none`}
                        required
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="name" className={label}>Name on card</label>
                <input id="name" value={values.name} onChange={set("name")} className={field} required />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="zip" className={label}>Postal code</label>
                <input id="zip" value={values.zip} onChange={set("zip")} className={field} required />
            </div>

            <Button
                type="submit"
                size="lg"
                disabled={paying}
                className="w-full h-12 text-base font-semibold"
            >
                {paying ? "Processing…" : `Pay ${formatPrice(amount)}`}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Demo checkout — no card is charged and no card data is sent anywhere.
            </p>
        </form>
    );
};
