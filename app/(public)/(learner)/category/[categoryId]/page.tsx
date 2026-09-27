import Image from "next/image";
import { Metadata } from "next";

import { Card } from "@/components/courses/ui/card";
import { getCoursesByCategoryId } from "@/server/course";
import { categoryMetaData } from "@/server/metadata";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";

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
        <PageContainer className="py-12 md:py-20 min-h-[60vh]">
            {courses && (
                <div className="mb-10">
                    <SectionHeader 
                        title={`${courses.category.name} Courses`}
                        subtitle={`Explore all ${courses.courses.length} courses in this category.`}
                    />
                </div>
            )}
            
            { (!courses || courses.courses.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl">
                    <div className="w-32 aspect-square relative opacity-50 mb-6">
                        <Image
                            src="/assets/bag.png"
                            fill
                            alt="Empty category"
                            className="object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        We are still working on adding courses to this category. Please check back later or explore other categories.
                    </p>
                </div>
            ) : (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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