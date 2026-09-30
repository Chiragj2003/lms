"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

import axios from 'axios';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
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

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const onClick = async()=>{

        if (!session.isPending && !session.data) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            const response =  await axios.post(`/api/courses/${courseId}/checkout`, { coupon : coupon });
            
            // Bypass Razorpay if free course / keys missing mock url returned
            if (response.data.url) {
                window.location.assign(response.data.url);
                return;
            }

            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const { orderId, amount, currency, courseName, courseDescription, tutorName, tutorEmail, keyId } = response.data;

            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: courseName,
                description: courseDescription,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await axios.post(`/api/courses/${courseId}/verify`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        if (verifyResponse.data.url) {
                            window.location.assign(verifyResponse.data.url);
                        } else {
                            toast.success("Payment successful!");
                            router.refresh();
                        }
                    } catch (error) {
                        console.log(error);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: tutorName || "",
                    email: tutorEmail || "",
                },
                theme: {
                    color: "#0f172a",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
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
