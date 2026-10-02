"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

import axios from 'axios';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import { payWithRazorpay } from '@/lib/razorpay-client';
import { Button } from '../ui/button';

interface CourseEnrollButtonProps {
    price : number;
    courseId: string;
    disabled?: boolean;
    coupon?: string; 
}

export const CourseEnrollButton = ({
    courseId,
    price,
    coupon,
    disabled
} : CourseEnrollButtonProps) => {

    const router = useRouter();
    const session = useSession();
    const [loading, setLoading] = useState(false);

    const onClick = async()=>{

        if (!session.isPending && !session.data) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            const response =  await axios.post(`/api/courses/${courseId}/checkout`, { coupon : coupon });
            
            // A free course (or the demo gateway) returns a URL instead of an order.
            if (response.data.url) {
                window.location.assign(response.data.url);
                return;
            }

            // Loads Razorpay's script once per page, rather than appending a
            // new <script> tag on every click, and keeps the button disabled
            // until the popup is paid or dismissed.
            const next = await payWithRazorpay(response.data, `/api/courses/${courseId}/verify`);
            if (next) {
                toast.success("Payment successful!");
                window.location.assign(next);
            }

        } catch (error) {
            // The server's reason ("Already purchased", "Tutors cannot purchase
            // courses", …) is more useful than a generic failure.
            toast.error(axios.isAxiosError(error) && typeof error.response?.data === "string"
                ? error.response.data
                : error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Button
            className='w-full h-12 text-base font-semibold'
            size="lg"
            onClick={onClick}
            disabled = {loading || disabled}
        >
            Enroll for {formatPrice(price)}
        </Button>
    )
}
