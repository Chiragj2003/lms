import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserProgressCount } from "@/server/progress";
import { NextResponse } from "next/server";

export async function POST(req : Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {
   
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const purchase = await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId : session.user.id,
                    courseId : params.courseId
                }
            }
        });

        if (!purchase) {
            return new NextResponse("Course is not purchased", {status: 403});
        }

        const existing = await db.cerificate.findUnique({
            where : {
                userId_courseId : {
                    userId : session.user.id,
                    courseId : params.courseId
                }
            }
        });

        if (existing) {
            return NextResponse.json(existing);
        }

        // Buying the course isn't enough — every published chapter has to be
        // completed first.
        const progress = await getUserProgressCount(session.user.id, params.courseId);
        if (progress < 100) {
            return new NextResponse("Complete every chapter to earn the certificate", {status: 403});
        }

        const certificate = await db.cerificate.create({
            data : {
                userId : session.user.id,
                courseId : params.courseId
            }
        });

        return NextResponse.json(certificate);
        
    } catch (error) {
        console.error("CERTIFICATE POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}