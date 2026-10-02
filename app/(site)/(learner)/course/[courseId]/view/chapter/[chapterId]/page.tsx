import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { VideoPlayer } from "@/components/utils/video-player";
import { Banner } from "@/components/utils/banner";
import { getChapter } from "@/server/chapter";
import { Options } from "@/components/chapters/ui/options";
import { chapterMetadata } from "@/server/metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ChapterPageProps {
    params : Promise<{
        chapterId: string;
        courseId: string;
    }>
}

export async function generateMetadata(props: ChapterPageProps): Promise<Metadata> {
    const params = await props.params;

    const data = await chapterMetadata(params.chapterId);

    if ( !data ) {
        return {
            title : "Chapter"
        };
    }

    return {
        title: data.title,
        openGraph: {
            images: {
                url : data.course.image!,
                height : 1200,
                width : 1200
            },
            type : "website",
        },
        category : "chapter"
    }
}

const ChapterPage = async (props: ChapterPageProps) => {
    const params = await props.params;

    const session = await auth();
    const userId = session?.user?.id;

    const { chapter, course, nextChapter, purchase, userProgress, certificate } = await getChapter({chapterId : params.chapterId, courseId: params.courseId, userId: userId ?? ""});
    if (!chapter || !course) {
        redirect("/");
    }

    // Free preview chapters are open to everyone; anything else needs an
    // account before it's worth showing (and buying) at all.
    if (!userId && !chapter.isFree) {
        redirect("/login");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div className="h-full">
            <div>
                {
                    userProgress?.isCompleted && (
                        <Banner
                            variant="success"
                            label="You already completed this chapter."
                        />
                    )
                }
                {
                    isLocked && (
                        <Banner
                            variant="warning"
                            label="You need to purchase this course to watch this chapter"
                        />
                    )
                }
                <div className="flex flex-col w-full">
                    <VideoPlayer
                        chapterId = {params.chapterId}
                        title = {chapter.title}
                        courseId = {params.courseId}
                        nextChapterId = {nextChapter?.id}
                        // Streamed through an access-checked route; the
                        // storage URL itself never reaches the browser.
                        videoUrl = {`/api/chapters/${params.chapterId}/video`}
                        isLocked = {isLocked}
                        completeOnEnd = {completeOnEnd}
                        thumbnail={course.image!}
                        certificate={!!certificate}
                        canEarnCertificate={!!purchase}
                    />
                </div>
            </div>
            {
                // Notes, Q&A, AI and progress all belong to an account, so a
                // signed-out preview gets an invitation instead of tools that
                // would fail on use.
                userId ? (
                    <Options
                        chapter={chapter}
                        course={course}
                        courseId={params.courseId}
                        isPurchased={!!purchase}
                        nextChapterId={nextChapter?.id}
                        userProgress={userProgress}
                        certificate={certificate}
                        quizId={chapter?.quiz?.id}
                        quizResultId={chapter?.quiz?.result[0]?.id}
                    />
                ) : (
                    <div className="border-t border-border mt-4 p-6 md:p-10">
                        <div className="max-w-xl mx-auto text-center space-y-4 p-8 rounded-2xl bg-muted border border-border">
                            <h2 className="text-xl font-semibold text-foreground">
                                You&apos;re watching a free preview of {chapter.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Create a free account to track your progress, take notes and ask questions — then enroll to unlock every chapter.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button asChild>
                                    <Link href="/register">Sign up free</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={`/course/${params.courseId}`}>View course details</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ChapterPage;