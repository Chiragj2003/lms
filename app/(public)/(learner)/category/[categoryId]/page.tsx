import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { Metadata } from "next";

import { Card } from "@/components/courses/ui/card";
import { getCoursesByCategoryId } from "@/server/course";
import { categoryMetaData } from "@/server/metadata";
import { PageContainer } from "@/components/ui/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
    params : Promise<{ categoryId : string }>
}


export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
    const params = await props.params;

    const data = await categoryMetaData(params.categoryId);

    if ( !data ) {
        return {};
    }

    return {
        title: data.name,
    }
}


const CategoryPage = async (props: CategoryPageProps) => {
    const params = await props.params;

    const courses = await getCoursesByCategoryId(params.categoryId);

    return (
        <PageContainer className="py-6 md:py-8 min-h-[60vh]">
            {courses && (
                <div className="relative mb-8 overflow-hidden rounded-[40px] bg-lilac px-6 py-10 sm:px-10 sm:py-12 text-ink">
                    <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
                        <Link href="/categories" className="underline-offset-4 hover:underline">Categories</Link>
                        <span aria-hidden="true"> / </span>
                        <span>{courses.category.name}</span>
                    </nav>
                    <h1 className="text-display mt-3">{courses.category.name}</h1>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="inline-flex h-8 items-center rounded-full bg-white px-4 text-sm font-medium">
                            {courses.courses.length} {courses.courses.length === 1 ? "course" : "courses"}
                        </span>
                    </div>
                    <svg aria-hidden="true" viewBox="0 0 150 110" className="pointer-events-none absolute -right-2 -bottom-2 h-56 w-80 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M30 92 L70 48 L104 82" /><circle cx="112" cy="30" r="16" /><path d="M104 54v10M120 54v10M20 104h120" />
                    </svg>
                </div>
            )}

            { (!courses || courses.courses.length === 0) ? (
                <EmptyState
                    className="rounded-[32px] bg-white py-16"
                    icon={<PackageOpen />}
                    title="No courses yet"
                    description="We're still adding courses to this category. Check back soon, or explore other categories."
                    action={
                        <Button asChild>
                            <Link href="/categories">Explore categories</Link>
                        </Button>
                    }
                />
            ) : (
                <section aria-label="Courses" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {courses.courses.map((item)=>(
                        <Card
                            course={item}
                            key={item.id}
                        />
                    ))}
                </section>
            )}
        </PageContainer>
    )
}

export default CategoryPage;