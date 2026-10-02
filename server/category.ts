// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";

export const getAllCategories = async () => {
    try {
        
        const categories = await db.subCategory.findMany({
            orderBy : {
                name : "asc"
            },
        });

        return categories;

    } catch (error) {
        return [];
    }
}