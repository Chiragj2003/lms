import * as z from "zod";

export const CouponSchema = z.object({
    coupon : z.string().trim()
        .min(6, { message : "Minimum 6 characters are required" })
        .max(40, { message : "Maximum 40 characters" })
        .regex(/^[A-Za-z0-9_-]+$/, { message : "Use letters, numbers, - or _ only" }),
    discount : z.number({ error : "Enter a discount" }).int({ message : "Use a whole number" }).min(1, { message : "Discount must be at least 1%" }).max(100, { message : "Discount can't be more than 100%" }),
    // Any unparseable string used to reach `new Date()` and crash the insert.
    expires : z.string().min(1, { message : "Pick an expiry date" })
        .refine((value) => !Number.isNaN(Date.parse(value)), { message : "Pick a valid date" })
        .refine((value) => Date.parse(value) > Date.now(), { message : "The expiry date must be in the future" }),
});
