import { db } from "@/lib/db";

// Razorpay allows at most 15 notes per order; one holds the user id and one
// the order type, leaving room for this many course ids.
export const MAX_CART_CHECKOUT = 13;

/**
 * The user's cart, minus anything they already own or that is no longer
 * published. Stale rows are removed as a side effect so the cart never offers
 * a course the user can't buy.
 */
export const getCartCourseIds = async (userId: string) => {
    const items = await db.cartItems.findMany({
        where : { userId },
        orderBy : { createdAt : "asc" },
        select : {
            courseId : true,
            course : {
                select : {
                    isPublished : true,
                    purchases : { where : { userId }, select : { id : true } }
                }
            }
        }
    });

    const stale = items.filter((item) => !item.course.isPublished || item.course.purchases.length > 0);
    if (stale.length > 0) {
        await db.cartItems.deleteMany({
            where : { userId, courseId : { in : stale.map((item) => item.courseId) } }
        });
    }

    return items
        .filter((item) => !stale.includes(item))
        .map((item) => item.courseId);
};

/** Grants every course and removes them from the cart. Safe to call twice. */
export const purchaseCourses = async (userId: string, courseIds: string[]) => {
    await db.$transaction([
        db.purchase.createMany({
            data : courseIds.map((courseId) => ({ userId, courseId })),
            skipDuplicates : true
        }),
        db.cartItems.deleteMany({
            where : { userId, courseId : { in : courseIds } }
        })
    ]);
};

export const cartOrderNotes = (userId: string, courseIds: string[]) => ({
    userId,
    type : "cart",
    ...Object.fromEntries(courseIds.map((courseId, i) => [`c${i}`, courseId]))
});

export const courseIdsFromNotes = (notes: Record<string, unknown> | undefined | null) =>
    Object.entries(notes ?? {})
        .filter(([key, value]) => /^c\d+$/.test(key) && typeof value === "string")
        .map(([, value]) => value as string);
