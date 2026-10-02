import { db } from "@/lib/db";

// What still has to be filled in before something can be published. The
// tutor pages show the same checklist, but only the page enforced it, so a
// direct request could publish a course with no chapters or price.

export const missingForCourse = async (courseId: string) => {
    const course = await db.course.findUnique({
        where : { id : courseId },
        select : {
            title : true,
            image : true,
            description : true,
            shortDescription : true,
            price : true,
            subCategoryId : true,
            chapters : { where : { isPublished : true }, select : { id : true }, take : 1 },
        },
    });

    if (!course) return ["the course"];

    const missing : string[] = [];
    if (!course.title) missing.push("a title");
    if (!course.shortDescription) missing.push("a short description");
    if (!course.description) missing.push("a description");
    if (!course.image) missing.push("an image");
    // 0 is a valid price: checkout enrols free courses without payment.
    if (course.price === null) missing.push("a price");
    if (!course.subCategoryId) missing.push("a category");
    if (course.chapters.length === 0) missing.push("at least one published chapter");
    return missing;
};

export const missingForChapter = async (chapterId: string) => {
    const chapter = await db.chapter.findUnique({
        where : { id : chapterId },
        select : { title : true, description : true, videoUrl : true },
    });

    if (!chapter) return ["the chapter"];

    const missing : string[] = [];
    if (!chapter.title) missing.push("a title");
    if (!chapter.description) missing.push("a description");
    if (!chapter.videoUrl) missing.push("a video");
    return missing;
};

export const missingForQuiz = async (chapterId: string) => {
    const quiz = await db.quiz.findUnique({
        where : { chapterId },
        select : {
            questions : {
                select : {
                    question : true,
                    options : { select : { answer : true, isCorrect : true } },
                },
            },
        },
    });

    if (!quiz) return ["the quiz"];
    if (quiz.questions.length === 0) return ["at least one question"];

    // Grading compares each answer to the option marked correct, so a
    // question without one marks every learner wrong.
    const missing : string[] = [];
    quiz.questions.forEach((question, i) => {
        const n = i + 1;
        if (!question.question.trim()) missing.push(`text for question ${n}`);
        const filled = question.options.filter((option) => option.answer.trim());
        if (filled.length < 2) missing.push(`at least two answers for question ${n}`);
        if (!question.options.some((option) => option.isCorrect)) missing.push(`a correct answer for question ${n}`);
    });
    return missing;
};

export const notReadyMessage = (missing: string[]) =>
    `Can't publish yet — add ${missing.join(", ")}.`;
