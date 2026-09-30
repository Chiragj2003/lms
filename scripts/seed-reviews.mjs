/**
 * Gives each course topic-relevant artwork and a realistic spread of reviews.
 *
 *   node scripts/seed-reviews.mjs
 *
 * Every course previously shared one image, which made the catalogue look
 * broken; the random-per-course image that replaced it fixed "identical" but
 * was still unrelated to the course's actual subject. Reviews need distinct
 * users (Rate is unique per user+course), so this creates a small pool of
 * demo reviewers, and each reviewer is also given a matching Purchase —
 * without one, a course could show real ratings next to "0 students
 * enrolled", since a rating was never required to come from a buyer.
 *
 * Idempotent: images are matched by course, reviewers by email, reviews and
 * purchases upserted.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Ordered most-specific first: the first matching keyword wins.
const TOPIC_IMAGES = [
    [["next.js", "react", "app router", "server component"], "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"],
    [["python", "bootcamp"], "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80"],
    [["typescript", "node", "javascript"], "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=800&q=80"],
    [["postgres", "sql", "database"], "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"],
    [["design", "interface", "ui", "ux"], "https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=800&q=80"],
    [["seo", "marketing", "product team"], "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"],
    [["financ", "accounting", "modelling"], "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"],
    [["razorpay", "payment"], "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"],
];
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80";

const imageForCourse = (title) => {
    const lower = title.toLowerCase();
    const match = TOPIC_IMAGES.find(([keywords]) => keywords.some((kw) => lower.includes(kw)));
    return match ? match[1] : FALLBACK_IMAGE;
};

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
    // 1. Topic-relevant artwork per course.
    const courses = await db.course.findMany({ select : { id : true, title : true } });

    for (const course of courses) {
        await db.course.update({
            where : { id : course.id },
            data  : { image : imageForCourse(course.title) }
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
    // Each reviewer also gets a Purchase of the course they're rating, so the
    // enrollment count shown next to the rating is never zero.
    let reviews = 0;
    for (const [ci, course] of courses.entries()) {
        const howMany = 4 + (ci % 4); // 4-7 reviews per course

        for (let r = 0; r < howMany; r++) {
            const reviewer = reviewers[(ci + r) % reviewers.length];
            const [star, comment] = COMMENTS[(ci + r) % COMMENTS.length];

            await db.purchase.upsert({
                where  : { userId_courseId : { userId : reviewer.id, courseId : course.id } },
                update : {},
                create : { userId : reviewer.id, courseId : course.id }
            });

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
