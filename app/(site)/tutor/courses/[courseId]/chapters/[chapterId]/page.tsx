import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Actions } from "@/components/chapters/forms/actions";
import { ChapterAccessForm } from "@/components/chapters/forms/chapter-access.form";
import { DescriptionForm } from "@/components/chapters/forms/description.form";
import { TitleForm } from "@/components/chapters/forms/title.form";
import { VideoForm } from "@/components/chapters/forms/video.form";
import { Progress } from "@/components/ui/progress";
import { Banner } from "@/components/utils/banner";
import { getChapterById } from "@/server/chapter";
import { ResourcesForm } from "@/components/chapters/forms/resource.form";
import { ArrowLeft, FileText, LayoutDashboard, Video } from "lucide-react";
import { QuizForm } from "@/components/chapters/forms/quiz.form";
import { VideoLengthForm } from "@/components/chapters/forms/video-lenght.form";
import { TranscriptForm } from "@/components/chapters/forms/transcript";
import { PageContainer } from "@/components/ui/page-container";

interface ChapterPageProps {
    params : Promise<{ courseId: string, chapterId: string }>
}

const ChapterPage = async (props: ChapterPageProps) => {
    const params = await props.params;

    const session = await auth();
    if (!session) {
        redirect("/");
    }

    const chapter = await getChapterById(params.chapterId, params.courseId, session.user.id);
    if (!chapter ) {
        redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="min-h-full">
            { !chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished. Learners won't see it in the course."
                />
            ) }
            
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur">
                <PageContainer className="py-4">
                    <Link
                        href={`/tutor/courses/${params.courseId}`}
                        className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm text-ink hover:bg-soft transition mb-4 font-medium group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to course setup
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-display-sm">
                                Chapter Builder
                            </h1>
                            <div className="flex items-center gap-x-3">
                                <span className="text-sm text-muted-foreground font-medium">Progress {completionText}</span>
                                <Progress value={(completedFields/totalFields)*100} className="w-48 h-2" />
                            </div>
                        </div>
                        <Actions
                            disabled={totalFields!==completedFields}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                            isPublished={chapter.isPublished}
                        />
                    </div>
                </PageContainer>
            </div>

            <PageContainer className="py-8">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Sticky Sidebar Nav */}
                    <div className="hidden lg:flex flex-col w-64 shrink-0 sticky top-40 space-y-2">
                        <a href="#basics" className="h-12 px-4 rounded-2xl text-[15px] font-medium bg-white hover:bg-soft text-ink transition-colors flex items-center gap-x-3">
                            <LayoutDashboard className="w-4 h-4 text-ink" />
                            Basic Info
                        </a>
                        <a href="#media" className="h-12 px-4 rounded-2xl text-[15px] font-medium bg-white hover:bg-soft text-ink transition-colors flex items-center gap-x-3">
                            <Video className="w-4 h-4 text-ink" />
                            Video & Media
                        </a>
                        <a href="#resources" className="h-12 px-4 rounded-2xl text-[15px] font-medium bg-white hover:bg-soft text-ink transition-colors flex items-center gap-x-3">
                            <FileText className="w-4 h-4 text-ink" />
                            Resources & Quiz
                        </a>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-12 max-w-3xl w-full mx-auto lg:mx-0 pb-20">
                        
                        {/* Section 1: Basics */}
                        <section id="basics" className="space-y-6 scroll-mt-40">
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-2xl text-ink font-medium tracking-tight flex items-center gap-x-3">
                                    <LayoutDashboard className="size-9 p-2 rounded-full bg-peri text-ink" />
                                    Customize chapter
                                </h2>
                                <p className="text-muted-foreground text-sm">Define the title, description, and preview access.</p>
                            </div>
                            <div className="space-y-6">
                                <TitleForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                                <DescriptionForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                                <ChapterAccessForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                            </div>
                        </section>

                        {/* Section 2: Media */}
                        <section id="media" className="space-y-6 scroll-mt-40">
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-2xl text-ink font-medium tracking-tight flex items-center gap-x-3">
                                    <Video className="size-9 p-2 rounded-full bg-peri text-ink" />
                                    Video content
                                </h2>
                                <p className="text-muted-foreground text-sm">Upload the primary learning video and its transcript.</p>
                            </div>
                            <div className="space-y-6">
                                <VideoForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                                <VideoLengthForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                                <TranscriptForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                            </div>
                        </section>

                        {/* Section 3: Resources */}
                        <section id="resources" className="space-y-6 scroll-mt-40">
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-2xl text-ink font-medium tracking-tight flex items-center gap-x-3">
                                    <FileText className="size-9 p-2 rounded-full bg-peri text-ink" />
                                    Learning materials
                                </h2>
                                <p className="text-muted-foreground text-sm">Attach files, resources, and build a quiz to test knowledge.</p>
                            </div>
                            <div className="space-y-6">
                                <ResourcesForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                                <QuizForm initialData={chapter} courseId={chapter.courseId} chapterId={chapter.id} />
                            </div>
                        </section>

                    </div>
                </div>
            </PageContainer>
        </div>
    )
}

export default ChapterPage