"use client";

import { useEffect } from "react";
import axios from "axios";

import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";

/**
 * On sign-in, merges whatever was added to the cart while signed out into the
 * learner's server-side cart, then adopts the server copy.
 */
export const CartSync = () => {

    const session = useSession();
    const userId = session.data?.user.id;
    const isLearner = !!userId && session.data?.user.role !== "TUTOR";

    useEffect(()=>{
        const { setItems, setSyncEnabled } = useCart.getState();

        if (!isLearner) {
            setSyncEnabled(false);
            return;
        }

        let cancelled = false;
        const localIds = useCart.getState().items.map((item)=>item.id);

        axios.post("/api/cart", { courseIds : localIds })
            .then((response)=>{
                if (cancelled) return;
                setItems(response.data);
                setSyncEnabled(true);
            })
            .catch(()=>{});

        return ()=>{ cancelled = true; };
    }, [userId, isLearner]);

    return null;
};
