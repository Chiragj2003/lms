import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { searchCourses } from "@/server/course";
import { CardWithRating } from "@/components/courses/ui/card-with-ratings";
import { PageContainer } from "@/components/ui/page-container";
import { SearchForm } from "@/components/courses/forms/search.form";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

interface SearchPageProps {
    searchParams : Promise<{
        query? : string;
        page? : string;
    }>
}

const SearchPage = async (props: SearchPageProps) => {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.query === "string" ? searchParams.query : "";
    const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    // An empty query still matches every published course, so this is the
    // catalog view rather than a dead end that needs typing something first.
    const { courses, total } = await searchCourses(query, page, PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageHref = (target: number) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (target > 1) params.set("page", String(target));
        const qs = params.toString();
        return qs ? `/search?${qs}` : "/search";
    };

    if (total === 0) {
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
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {query ? `No courses found for "${query}"` : "No courses available yet"}
                            </h3>
                            <p className="text-muted-foreground">
                                Try searching with different keywords or explore popular categories.
                            </p>
                        </div>
                    </div>
                </div>
            </PageContainer>
        )
    }

    const courseLabel = total === 1 ? "course" : "courses";

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
                        {query ? "Discover your next skill" : "Browse all courses"}
                    </h1>
                    <p className="text-muted text-lg max-w-xl mx-auto">
                        {query
                            ? `${total} ${courseLabel} found for "${query}"`
                            : `${total} ${courseLabel} available right now`}
                    </p>
                    <div className="w-full max-w-2xl mx-auto mt-6">
                        <SearchForm />
                    </div>
                </PageContainer>
            </div>

            <PageContainer className="py-12">
                <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                    <h2 className="text-xl font-bold text-foreground">
                        All {query ? "Results" : "Courses"} ({total})
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground">
                        Most popular first
                    </span>
                </div>

                {courses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">
                        There&apos;s nothing on this page.{" "}
                        <Link href={pageHref(1)} className="text-primary underline underline-offset-4">Back to the first page</Link>
                    </p>
                ) : (
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
                )}

                {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-4 mt-12" aria-label="Pagination">
                        {page > 1 ? (
                            <Button asChild variant="outline">
                                <Link href={pageHref(page - 1)} rel="prev">
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" disabled>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Page {Math.min(page, totalPages)} of {totalPages}
                        </span>
                        {page < totalPages ? (
                            <Button asChild variant="outline">
                                <Link href={pageHref(page + 1)} rel="next">
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" disabled>
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </nav>
                )}
            </PageContainer>
        </div>
    )
}

export default SearchPage
