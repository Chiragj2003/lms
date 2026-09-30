import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {

        // Only published courses count, and empty categories are left out:
        // most of the catalogue's categories have nothing in them yet, and a
        // homepage row of "0 courses" tiles advertised that.
        const categories = await db.subCategory.findMany({
            where : {
                courses : { some : { isPublished : true } }
            },
            include :{
                _count : {
                    select : {
                        courses : { where : { isPublished : true } }
                    }
                }
            },
            orderBy : {
                courses : {
                    _count : "desc"
                }
            },
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.error("CATEGORY PUBLIC API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
