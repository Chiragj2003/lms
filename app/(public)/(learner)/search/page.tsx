import Image from "next/image";
import { searchCourses } from "@/server/course";
import { CardWithRating } from "@/components/courses/ui/card-with-ratings";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchForm } from "@/components/courses/forms/search.form";


interface SearchPageProps {
    searchParams : Promise<{
        query : string
    }>
}

const SearchPage = async (props: SearchPageProps) => {
    const searchParams = await props.searchParams;

    if (!searchParams.query){
        return (
            <PageContainer className="py-20 md:py-32">
                <div className="max-w-xl mx-auto text-center space-y-8">
                    <SectionHeader 
                        title="Search Courses"
                        subtitle="Find the perfect course to advance your career."
                    />
                    <SearchForm />
                </div>
            </PageContainer>
        )
    }

    const courses = await searchCourses(searchParams.query);

    if (courses.length === 0) {
        return (
            <PageContainer className="py-20 md:py-32">
                <div className="max-w-xl mx-auto space-y-8">
                    <SearchForm />
                    <div className="flex flex-col items-center justify-center pt-10">
                        <div className="relative h-48 aspect-square opacity-70">
                            <Image
                                src="/assets/empty.jpg"
                                fill
                                alt="No results"
                                className="object-contain"
                            />
                        </div>
                        <div className="text-center mt-6">
                            <h3 className="text-xl font-semibold text-foreground mb-2">No courses found for &quot;{searchParams.query}&quot;</h3>
                            <p className="text-muted-foreground">
                                Try searching with different keywords or explore popular categories.
                            </p>
                        </div>
                    </div>
                </div>
            </PageContainer>
        )
    }

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            {/* Search Header Banner */}
            <div className="bg-foreground text-background py-16 md:py-24 px-4 relative overflow-hidden">
                {/* Subtle decorations */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-highlight rounded-full blur-3xl" />
                </div>
                
                <PageContainer className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Discover your next skill
                    </h1>
                    <p className="text-muted text-lg max-w-xl mx-auto">
                        Showing {courses.length} highly rated {courses.length === 1 ? 'course' : 'courses'} for &quot;{searchParams.query}&quot;
                    </p>
                    <div className="w-full max-w-2xl mx-auto mt-6">
                        <SearchForm />
                    </div>
                </PageContainer>
            </div>
            
            <PageContainer className="py-12">
                <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                    <h2 className="text-xl font-bold text-foreground">
                        All Results ({courses.length})
                    </h2>
                    {/* Placeholder for future sorting/filtering */}
                    <div className="text-sm font-medium text-muted-foreground bg-card border border-border px-4 py-2 rounded-lg">
                        Most Relevant
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {
                        courses.map((course)=>(
                            <CardWithRating
                                key={course.id}
                                course={course}
                            />
                        ))
                    }
                </div>
            </PageContainer>
        </div>
    )
}

export default SearchPage