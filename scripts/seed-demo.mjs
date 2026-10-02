/**
 * Seeds demo courses, chapters, quizzes, purchases and reviews.
 *
 *   node scripts/seed-demo.mjs
 *
 * Idempotent: courses are matched by title, so re-running updates rather than
 * duplicating. Reuses the existing Cloudinary image and EdgeStore video already
 * in the database so seeded content actually renders and plays.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const IMAGE = "https://res.cloudinary.com/dhkq9icc5/image/upload/v1762110188/aaqsfaiidpoq051pljmu.jpg";
const VIDEO = "https://files.edgestore.dev/k07eqvcnhw0kq0xm/publicFiles/_public/e3e16506-218c-4ac9-a463-84c2816c2252.mp4";

// Every seeded chapter reuses the same demo video, so every seeded chapter is
// this long. (An earlier version invented a different length per chapter;
// that disagreed with the player, which shows the real 2:23.) Real courses
// get their length read from the uploaded video.
const VIDEO_SECONDS = 143;
const chapterDuration = () => VIDEO_SECONDS;

// BlockNote stores rich text as a JSON document; this is the minimal valid shape.
const doc = (text) => JSON.stringify([{
    id : crypto.randomUUID(),
    type : "paragraph",
    props : { textColor : "default", backgroundColor : "default", textAlignment : "left" },
    content : [{ type : "text", text, styles : {} }],
    children : []
}], null, 2);

const COURSE_DATA = [
    {
        title : "Next.js 16 in Practice: App Router and Server Components",
        short : "Build production React apps with the App Router, streaming and server actions.",
        sub : "Web Development",
        price : 3499,
        chapters : [
            "Why the App Router changes everything",
            "Server Components vs Client Components",
            "Data fetching and caching",
            "Server Actions and mutations"
        ],
        quiz : {
            passing : 2,
            questions : [
                ["Which directive marks a Client Component?", ['"use client"', '"use server"', '"client"', "No directive needed"], 0],
                ["Where do Server Components run?", ["On the server only", "In the browser only", "Both", "In a web worker"], 0],
                ["What does revalidatePath do?", ["Purges a cached route", "Redirects the user", "Deletes a file", "Restarts the server"], 0]
            ]
        }
    },
    {
        title : "PostgreSQL for Application Developers",
        short : "Indexes, query plans and the SQL you actually need to ship fast features.",
        sub : "Database Design",
        price : 2999,
        chapters : [
            "Relational modelling without regret",
            "Indexes and how the planner uses them",
            "Reading EXPLAIN ANALYZE",
            "Transactions and isolation levels"
        ],
        quiz : {
            passing : 2,
            questions : [
                ["What does EXPLAIN ANALYZE add over EXPLAIN?", ["It actually runs the query", "It formats output", "It creates an index", "Nothing"], 0],
                ["Which index suits equality lookups?", ["B-tree", "GiST", "BRIN", "None"], 0],
                ["What isolation level is Postgres default?", ["Read Committed", "Serializable", "Repeatable Read", "Read Uncommitted"], 0]
            ]
        }
    },
    {
        title : "TypeScript Deep Dive: Types That Catch Real Bugs",
        short : "Generics, narrowing and inference, aimed at everyday application code.",
        sub : "Programming Languages",
        price : 2499,
        chapters : [
            "Structural typing and why it surprises you",
            "Narrowing, guards and discriminated unions",
            "Generics without the headache",
            "Utility types in anger"
        ]
    },
    {
        title : "Designing Interfaces People Understand",
        short : "Hierarchy, type and colour decisions grounded in how people actually read screens.",
        sub : "User Interface (UI) Design",
        price : 1999,
        chapters : [
            "Visual hierarchy from first principles",
            "Type scales and readable measure",
            "Colour, contrast and accessibility",
            "Designing empty and error states"
        ]
    },
    {
        title : "SEO for Product Teams",
        short : "Technical SEO, content structure and measurement that survives a redesign.",
        sub : "SEO (Search Engine Optimization)",
        price : 1499,
        chapters : [
            "How crawlers actually see your site",
            "Information architecture and internal links",
            "Structured data that earns rich results",
            "Measuring what matters"
        ]
    },
    {
        title : "Financial Modelling Fundamentals",
        short : "Build a three-statement model from scratch and stress-test the assumptions.",
        sub : "Financial Management",
        price : 2799,
        chapters : [
            "The three statements and how they link",
            "Revenue drivers and assumptions",
            "Building the model",
            "Sensitivity and scenario analysis"
        ]
    }
];

const run = async () => {
    const tutors = await db.user.findMany({ where : { role : "TUTOR" } });
    const learners = await db.user.findMany({ where : { role : "LEARNER" } });

    if (!tutors.length) {
        throw new Error("no TUTOR users found — cannot attribute courses");
    }
    console.log(`tutors: ${tutors.length}, learners: ${learners.length}\n`);

    const created = [];

    for (const [i, c] of COURSE_DATA.entries()) {
        const sub = await db.subCategory.findUnique({ where : { name : c.sub } });
        const tutor = tutors[i % tutors.length];

        const existing = await db.course.findFirst({ where : { title : c.title } });

        const data = {
            title : c.title,
            shortDescription : c.short,
            description : doc(`${c.short} This course walks through the material step by step, with a short quiz to check what stuck.`),
            image : IMAGE,
            price : c.price,
            isPublished : true,
            tutorId : tutor.id,
            subCategoryId : sub?.id ?? null
        };

        const course = existing
            ? await db.course.update({ where : { id : existing.id }, data })
            : await db.course.create({ data });

        created.push(course);

        // Chapters
        for (const [pos, title] of c.chapters.entries()) {
            const hasChapter = await db.chapter.findFirst({
                where : { courseId : course.id, title }
            });
            if (hasChapter) {
                // Re-running the seed after the duration formula changed
                // shouldn't leave already-created chapters on the old
                // (identical, placeholder) value.
                await db.chapter.update({
                    where : { id : hasChapter.id },
                    data : { duration : chapterDuration(i, pos) }
                });
                continue;
            }

            const chapter = await db.chapter.create({
                data : {
                    title,
                    description : doc(`In this chapter: ${title.toLowerCase()}.`),
                    videoUrl : VIDEO,
                    duration : chapterDuration(i, pos),
                    position : pos,
                    isPublished : true,
                    // First chapter is the free preview.
                    isFree : pos === 0,
                    courseId : course.id
                }
            });

            // Quiz lives on the last chapter, when the course defines one.
            if (c.quiz && pos === c.chapters.length - 1) {
                const quiz = await db.quiz.create({
                    data : {
                        chapterId : chapter.id,
                        isPublished : true,
                        requiredPassingScore : c.quiz.passing
                    }
                });

                for (const [qi, [question, answers, correct]] of c.quiz.questions.entries()) {
                    const q = await db.quizQuestion.create({
                        data : { question, position : qi, quizId : quiz.id }
                    });
                    await db.option.createMany({
                        data : answers.map((answer, ai) => ({
                            answer,
                            isCorrect : ai === correct,
                            questionId : q.id
                        }))
                    });
                }
            }
        }
    }

    console.log(`courses ready: ${created.length}`);

    // Purchases + reviews, so the learner dashboards aren't empty.
    const REVIEWS = [
        [5, "Clear, well paced, and the examples are real rather than toy."],
        [4, "Solid material. I'd have liked a bit more depth on the last section."],
        [5, "Exactly what I needed to get unstuck. The quiz was a good check."],
        [4, "Good course. Audio could be a touch louder in places."]
    ];

    let purchases = 0;
    let reviews = 0;

    for (const [li, learner] of learners.entries()) {
        // Each learner buys the first three courses.
        for (const course of created.slice(0, 3)) {
            await db.purchase.upsert({
                where  : { userId_courseId : { userId : learner.id, courseId : course.id } },
                update : {},
                create : { userId : learner.id, courseId : course.id }
            });
            purchases++;

            const [star, comment] = REVIEWS[(li + purchases) % REVIEWS.length];
            await db.rate.upsert({
                where  : { userId_courseId : { userId : learner.id, courseId : course.id } },
                update : { star, comment },
                create : { userId : learner.id, courseId : course.id, star, comment }
            });
            reviews++;
        }
    }

    console.log(`purchases: ${purchases}`);
    console.log(`reviews: ${reviews}`);

    const totals = {
        courses : await db.course.count(),
        chapters : await db.chapter.count(),
        quizzes : await db.quiz.count(),
        questions : await db.quizQuestion.count(),
        purchases : await db.purchase.count(),
        reviews : await db.rate.count()
    };
    console.log("\nfinal totals:", totals);
};

run()
    .catch((error) => {
        console.error("seed failed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
