import { auth } from "@/auth"
import { redirect } from "next/navigation";

import { IndianRupee, LayoutDashboard, ListChecks } from "lucide-react";
import { getCourseById } from "@/server/course";
import { Progress } from "@/components/ui/progress";
import { TitleForm } from "@/components/courses/forms/title.form";
import { DescriptionForm } from "@/components/courses/forms/description.form";
import { ImageForm } from "@/components/courses/forms/image.form";
import { getAllCategories } from "@/server/category";
import { CategoryForm } from "@/components/courses/forms/category.form";
import { PriceForm } from "@/components/courses/forms/price.form";
import { ChaptersForm } from "@/components/courses/forms/chapters.form";
import { Banner } from "@/components/utils/banner";
import { Actions } from "@/components/courses/actions/actions";
import { ShortDescriptionForm } from "@/components/courses/forms/short-description.form";
import { CouponForm } from "@/components/courses/forms/coupon.form";
import { PageContainer } from "@/components/ui/page-container";


interface CoursePageProps {
    params : Promise<{
        courseId : string
    }>
}

export const revalidate = 0;

const CoursePage = async (props: CoursePageProps) => {
    const params = await props.params;

    const session = await auth();

    if (!session){
        return redirect("/");
    }

    const course = await getCourseById(params.courseId);
    if ( !course || course.tutorId !== session.user.id ){
        return redirect("/");
    }

    const categories = await getAllCategories();

    const requiredFields = [
        course.title,
        course.image,
        course.description,
        // 0 is a valid (free) price; only an unset price is incomplete.
        course.price !== null,
        course.subCategoryId,
        course.shortDescription,
        course.chapters.some((chapter)=>chapter.isPublished)
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`

    return (
        <div className="min-h-full">
            {
                !course.isPublished && (
                    <Banner variant="warning" label="This course is unpublished. It will not be visible to learners." />
                )
            }
            
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur">
                <PageContainer className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-display-sm">
                                Course Builder
                            </h1>
                            <div className="flex items-center gap-x-3">
                                <span className="text-sm text-muted-foreground font-medium">Progress {completionText}</span>
                                <Progress value={(completedFields/totalFields)*100} className="w-48 h-2" />
                            </div>
                        </div>
                        <Actions
                            courseId={params.courseId}
                            isPublished = {course.isPublished}
                            disabled = {totalFields!==completedFields}
                        />
                    </div>
                </PageContainer>
            </div>

            <PageContainer className="py-8">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Sticky Sidebar Nav */}
                    <div className="hidden lg:flex flex-col w-64 shrink-0 sticky top-32 space-y-2">
                        <a href="#basics" className="h-12 px-4 rounded-2xl text-[15px] font-medium bg-white hover:bg-soft text-ink transition-colors flex items-center gap-x-3">
                            <LayoutDashboard className="w-4 h-4 text-ink" />
                            Basic Info
                        </a>
                        <a href="#curriculum" className="h-12 px-4 rounded-2xl text-[15px] font-medium bg-white hover:bg-soft text-ink transition-colors flex items-center gap-x-3">
                            <ListChecks className="w-4 h-4 text-ink" />
                            Curriculum
                        </a>
                        <a href="#pricing" className="h-12 px-4 rounded-2xl text-[15px] font-medium bg-white hover:bg-soft text-ink transition-colors flex items-center gap-x-3">
                            <IndianRupee className="w-4 h-4 text-ink" />
                            Pricing & Sales
                        </a>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-12 max-w-3xl w-full mx-auto lg:mx-0 pb-20">
                        
                        {/* Section 1: Basics */}
                        <section id="basics" className="space-y-6 scroll-mt-32">
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-2xl text-ink font-medium tracking-tight flex items-center gap-x-3">
                                    <LayoutDashboard className="size-9 p-2 rounded-full bg-peri text-ink" />
                                    Customize your course
                                </h2>
                                <p className="text-muted-foreground text-sm">Provide the foundational details that learners will see.</p>
                            </div>
                            <div className="space-y-6">
                                <TitleForm initialData={course} courseId={course.id} />
                                <ShortDescriptionForm initialData={course} courseId={course.id} />
                                <DescriptionForm initialData={course} courseId={course.id} />
                                <ImageForm initialData={course} courseId={course.id} />
                                <CategoryForm
                                    initialData={course}
                                    courseId={course.id}
                                    options={categories.map((category)=>({
                                        label: category.name,
                                        value: category.id,
                                    }))}
                                />
                            </div>
                        </section>

                        {/* Section 2: Curriculum */}
                        <section id="curriculum" className="space-y-6 scroll-mt-32">
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-2xl text-ink font-medium tracking-tight flex items-center gap-x-3">
                                    <ListChecks className="size-9 p-2 rounded-full bg-peri text-ink" />
                                    Course chapters
                                </h2>
                                <p className="text-muted-foreground text-sm">Organize your course content into chapters and quizzes.</p>
                            </div>
                            <ChaptersForm initialData={course} courseId={course.id} />
                        </section>

                        {/* Section 3: Pricing */}
                        <section id="pricing" className="space-y-6 scroll-mt-32">
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-2xl text-ink font-medium tracking-tight flex items-center gap-x-3">
                                    <IndianRupee className="size-9 p-2 rounded-full bg-peri text-ink" />
                                    Sell your course
                                </h2>
                                <p className="text-muted-foreground text-sm">Set your price and manage promotional coupons.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PriceForm initialData={course} courseId={course.id} />
                                <CouponForm initialData={course} courseId={course.id} />
                            </div>
                        </section>

                    </div>
                </div>
            </PageContainer>
        </div>
    )
}

export default CoursePage;