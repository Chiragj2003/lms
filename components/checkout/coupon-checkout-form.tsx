"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CouponSchema } from "@/schemas/coupon-checkout.scheama";
import { Share2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseEnrollButton } from "@/components/utils/course-enroll-button";


interface CouponCheckoutFormProps {
    courseId : string;
    price : number;
    title : string;
    setPrice : (price: number)=>void;
    currentPrice: number;
}


export const CouponCheckoutForm = ({
    courseId,
    price,
    title,
    setPrice,
    currentPrice
} : CouponCheckoutFormProps ) => {

    
    const [appliedCoupon, setAppliedCoupon] = useState<string|undefined>();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<z.infer<typeof CouponSchema>>({
        resolver : zodResolver(CouponSchema),
        defaultValues : {
            coupon : ""
        }
    });


    const { isValid } = form.formState;

    const onSubmit = async(value: z.infer<typeof CouponSchema>)=>{
        try {
            
            setIsLoading(true)
            const response = await axios.get(`/api/courses/${courseId}/checkout/coupon?coupon=${value.coupon}`);
            setAppliedCoupon(response.data.coupon);
            setPrice((currentPrice - (currentPrice*response.data.discount/100)));
        } catch (error) {
            console.log(error);
            if ( axios.isAxiosError(error) ){
                toast.error(`${error.response?.data}`);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onShare = async()=>{
        const url = window.location.href;
        // Most desktop browsers have no Web Share API; copy the link instead.
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // The user closed the share sheet.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard");
        } catch {
            toast.error("Couldn't copy the link");
        }
    }


    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-y-6">
                {
                    appliedCoupon && (
                        <div className="w-full py-2 px-3 rounded-lg border border-dashed border-primary/50 bg-accent">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-mono font-semibold text-foreground">
                                        {appliedCoupon}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        is applied
                                    </span>
                                </div>
                                <Button
                                    className="h-8 w-8"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Remove coupon"
                                    onClick={()=>{
                                        setPrice(currentPrice);
                                        setAppliedCoupon(undefined);
                                        form.reset();
                                    }}
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    )
                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex items-center gap-2 w-full">
                            <FormField
                                control={form.control}
                                name="coupon"
                                render={({field})=>(
                                    <FormItem className="w-full flex-1 space-y-0">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-10"
                                                disabled = { isLoading || !!appliedCoupon }
                                                placeholder="Coupon code"
                                                aria-label="Coupon code"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="h-10 font-semibold"
                                disabled = { isLoading || !!appliedCoupon || !isValid }
                            >
                                Apply
                            </Button>
                        </div>
                    </form>
                </Form>
                <CourseEnrollButton
                    courseId={courseId}
                    price={price}
                    disabled={isLoading}
                    coupon={appliedCoupon}
                />
                <p className="text-xs text-center text-muted-foreground">Full lifetime access</p>
            </div>
            <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={onShare}
            >
                <Share2 className="h-4 w-4 mr-2" />
                Share this course
            </Button>
        </div>
    )
}
