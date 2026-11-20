import Link from "next/link";
import Image from "next/image";
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
            <PageContainer className="py-12 md:py-20">
                <div className="max-w-2xl mx-auto space-y-8">
                    <SearchForm />
                    <div className="flex flex-col items-center justify-center rounded-[32px] bg-white px-6 py-14 text-center">
                        <Image src="/assets/illustrations/not-found.webp" alt="" width={865} height={900} sizes="240px" className="h-44 sm:h-52 w-auto" aria-hidden="true" />
                        <div className="mt-6">
                            <h3 className="text-2xl font-medium tracking-tight text-ink mb-2">
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
        <div className="min-h-screen pb-10">
            {/* Search header */}
            <PageContainer className="pt-8 md:pt-12">
                <div className="flex flex-col gap-5">
                    <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2">Courses</p>
                    <h1 className="text-display-sm">
                        {query ? "Find your next course" : "Browse all courses"}
                    </h1>
                    <p className="text-ink-2 text-lg">
                        {query
                            ? `${total} ${courseLabel} found for "${query}"`
                            : `${total} ${courseLabel} available right now`}
                    </p>
                    <div className="w-full max-w-2xl">
                        <SearchForm />
                    </div>
                </div>
            </PageContainer>

            <PageContainer className="py-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-xl font-medium tracking-tight text-ink">
                        All {query ? "Results" : "Courses"} ({total})
                    </h2>
                    <span className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-medium text-ink">
                        Most popular first
                    </span>
                </div>

                {courses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">
                        There&apos;s nothing on this page.{" "}
                        <Link href={pageHref(1)} className="text-primary underline underline-offset-4">Back to the first page</Link>
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                        <span className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-ink">
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
