import { db } from './lib/db';

async function seed() {
    console.log("Fetching a tutor user...");
    const tutor = await db.user.findFirst();

    if (!tutor) {
        console.error("No users found in database to act as a tutor! Please login first.");
        process.exit(1);
    }

    console.log(`Using tutor: ${tutor.name || tutor.email} (${tutor.id})`);

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

    console.log("Seeding dummy courses...");

    for (const courseData of dummyCourses) {
        const course = await db.course.create({
            data: courseData,
        });

        // Add one published chapter so the course is viewable/has content
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

        console.log(`Created course: ${course.title} (ID: ${course.id})`);
    }

    console.log("Done! You can now browse and purchase these dummy courses.");
}

seed().catch(console.error).finally(() => process.exit(0));
