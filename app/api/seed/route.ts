import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tutor = await db.user.findFirst();

        if (!tutor) {
            return NextResponse.json({ error: "No users found in database to act as a tutor! Please login first." }, { status: 400 });
        }

        const dummyCourses = [
            {
                title: "Advanced React with Next.js",
                shortDescription: "Master Server Components and Server Actions in this comprehensive guide.",
                description: "Detailed course description goes here. It covers all the core topics...",
                price: 999, // ₹999
                isPublished: true,
                tutorId: tutor.id,
            },
            {
                title: "Mastering TypeScript & Node.js",
                shortDescription: "Build scalable and type-safe backend systems with ease.",
                description: "Detailed course description for TS and Node.js...",
                price: 1499,
                isPublished: true,
                tutorId: tutor.id,
            },
            {
                title: "Introduction to Razorpay Integrations",
                shortDescription: "Learn how to accept payments seamlessly in India.",
                description: "A short crash course on integrating Razorpay.",
                price: 10,
                isPublished: true,
                tutorId: tutor.id,
            },
        ];

        for (const courseData of dummyCourses) {
            const course = await db.course.create({
                data: courseData,
            });

            await db.chapter.create({
                data: {
                    title: "Introduction",
                    description: "Welcome to the course!",
                    position: 1,
                    isPublished: true,
                    isFree: true,
                    courseId: course.id,
                }
            });
        }

        return NextResponse.json({ message: "Seed successful!" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
