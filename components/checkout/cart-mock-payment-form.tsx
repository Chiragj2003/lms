"use client";

import { useCart } from "@/hooks/use-cart";
import { MockPaymentForm } from "@/components/checkout/mock-payment-form";

export const CartMockPaymentForm = ({ amount } : { amount : number }) => (
    <MockPaymentForm
        amount={amount}
        confirmUrl="/api/cart/checkout/confirm"
        successUrl="/user/my-learning"
        onSuccess={()=>useCart.getState().clear()}
    />
);
