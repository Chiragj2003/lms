/**
 * Gives each course its own artwork and a realistic spread of reviews.
 *
 *   node scripts/seed-reviews.mjs
 *
 * Every course previously shared one image, which made the catalogue look
 * broken. Reviews need distinct users (Rate is unique per user+course), so
 * this creates a small pool of demo reviewers.
 *
 * Idempotent: images are matched by course, reviewers by email, reviews upserted.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);

const REVIEWERS = [
    "Aditya Rao", "Meera Nair", "Rohan Gupta", "Sana Kapoor",
    "Vikram Sethi", "Priya Menon", "Karan Malhotra", "Ishita Bose"
];

const COMMENTS = [
    [5, "Clear and well paced. The examples are real rather than toy problems."],
    [4, "Solid material. I'd have liked more depth in the final section."],
    [5, "Exactly what I needed to get unstuck, and the quiz was a good check."],
    [4, "Good explanations throughout. Audio is a little quiet in places."],
    [5, "Worth it for the walkthroughs alone. I came back to them twice."],
    [3, "Useful, but assumes a bit more background than the description suggests."],
    [5, "Straight to the point, no padding. Finished it in a weekend."],
    [4, "Practical and well structured. Would take another course from this tutor."]
];

const run = async () => {
    // 1. Distinct artwork per course.
    const courses = await db.course.findMany({ select : { id : true, title : true } });

    for (const course of courses) {
        await db.course.update({
            where : { id : course.id },
            // Seeded URL => stable image per course, but different from its peers.
            data  : { image : `https://picsum.photos/seed/${slug(course.title)}/800/450` }
        });
    }
    console.log(`course artwork updated: ${courses.length}`);

    // 2. A pool of reviewers, since one user can only review a course once.
    const reviewers = [];
    for (const [i, name] of REVIEWERS.entries()) {
        const email = `demo.reviewer${i + 1}@example.com`;
        const user = await db.user.upsert({
            where  : { email },
            update : {},
            create : {
                email,
                name,
                role : "LEARNER",
                emailVerified : true,
                image : `https://i.pravatar.cc/150?img=${i + 11}`
            }
        });
        reviewers.push(user);
    }
    console.log(`demo reviewers ready: ${reviewers.length}`);

    // 3. Reviews spread across courses, varying count so ratings differ.
    let reviews = 0;
    for (const [ci, course] of courses.entries()) {
        const howMany = 4 + (ci % 4); // 4-7 reviews per course

        for (let r = 0; r < howMany; r++) {
            const reviewer = reviewers[(ci + r) % reviewers.length];
            const [star, comment] = COMMENTS[(ci + r) % COMMENTS.length];

            await db.rate.upsert({
                where  : { userId_courseId : { userId : reviewer.id, courseId : course.id } },
                update : { star, comment },
                create : { userId : reviewer.id, courseId : course.id, star, comment }
            });
            reviews++;
        }
    }
    console.log(`reviews written: ${reviews}`);

    const avg = await db.rate.aggregate({ _avg : { star : true }, _count : true });
    console.log(`\ntotal reviews: ${avg._count}, average rating: ${avg._avg.star?.toFixed(2)}`);
};

run()
    .catch((e) => { console.error("failed:", e.message); process.exitCode = 1; })
    .finally(() => db.$disconnect());
