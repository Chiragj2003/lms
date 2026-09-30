import Image from "next/image";
import { redirect } from "next/navigation";

import { Header } from "@/components/utils/header";
import { getCourseByPublicId } from "@/server/course";
import { Header as CourseHeader } from "@/components/courses/ui/header";
import { Chapters } from "@/components/courses/ui/chapters";
import { Description } from "@/components/courses/ui/description";
import { SubscriptionCard } from "@/components/courses/ui/subscription-card";
import { Metadata } from "next";
import { courseMetadata } from "@/server/metadata";
import "./style.css"
import { InstructorDescription } from "@/components/courses/ui/instructor-description";
import { Reviews } from "@/components/courses/ui/reviews";
import { PageContainer } from "@/components/ui/page-container";
import { auth } from "@/auth";
import { db } from "@/lib/db";


interface CoursePageProps {
    params : Promise<{courseId: string}>;
}

export async function generateMetadata(props: CoursePageProps): Promise<Metadata> {
    const params = await props.params;

    const data = await courseMetadata(params.courseId);

    if ( !data ) {
        return {};
    }

    return {
        title: data.title,
        description: data.shortDescription,
        openGraph: {
            images: {
                url : data.image!,
                height : 1200,
                width : 1200
            },
            type : "website",
        },
        category : "course"
    }
}


const CoursePage = async (props:CoursePageProps) => {
    const params = await props.params;

    const { course, avgRating } = await getCourseByPublicId(params.courseId);
    if (!course) {
        redirect("/");
    }

    const session = await auth();
    const purchase = session?.user?.id
        ? await db.purchase.findUnique({
            where : { userId_courseId : { userId : session.user.id, courseId : course.id } },
            select : { id : true }
        })
        : null;
    const isPurchased = !!purchase;

    return (
        <div className="flex flex-col min-h-screen">
            <Header variant="default" />
            
            <main className="flex-1 pb-24">
                <CourseHeader
                    id={course.id}
                    title={course.title}
                    shortDescription={course.shortDescription!}
                    lastUpdated={course.updatedAt}
                    subCategory={course.subCategory}
                    tutorImage={course.tutor.image}
                    tutorName={course.tutor.name!}
                    tutorProfile={course.tutor.profile?.description}
                    avgRating={avgRating._avg.star!}
                    purchases={course._count.purchases}
                    ratings={course._count.ratings}
                    isPurchased={isPurchased}
                    previewChapterId={course.chapters.find((chapter)=>chapter.isFree)?.id}
                />
                
                <PageContainer className="mt-12 md:mt-16">
                    <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 relative items-start">
                        {/* Main Content Column */}
                        <div className="w-full lg:w-2/3 space-y-12">
                            <Chapters chapters={course.chapters} />
                            <Description description={course.description!} />
                            <InstructorDescription tutor={course.tutor} />
                            <Reviews reviews={course.ratings} courseId={course.id}  />
                        </div>
                        
                        {/* Sidebar Column */}
                        <div className="w-full lg:w-1/3 static lg:sticky lg:top-24 z-10">
                            <SubscriptionCard
                                courseId={params.courseId}
                                title={course.title}
                                poster={course.image!}
                                price={course.price!}
                                course={course}
                                avgRating={avgRating._avg.star ?? 0}
                                totalRatings={course._count.ratings}
                                totalPurchases={course._count.purchases}
                                tutorName={course.tutor.name ?? ""}
                                isPurchased={isPurchased}
                            />
                        </div>
                    </div>
                </PageContainer>
            </main>
        </div>
    )
}

export default CoursePage;