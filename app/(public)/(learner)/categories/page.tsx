import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { db } from "@/lib/db";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";

const courseCount = (count: number) => `${count} ${count === 1 ? "course" : "courses"}`;

const CategoriesPage = async () => {

    const categories = await db.category.findMany({
        orderBy : { name : "asc" },
        include : {
            subcategories : {
                orderBy : { name : "asc" },
                include : {
                    _count : {
                        select : { courses : { where : { isPublished : true } } }
                    }
                }
            }
        }
    });

    return (
        <PageContainer className="py-12 md:py-20 min-h-[60vh]">
            <div className="mb-10">
                <SectionHeader
                    title="Browse by category"
                    subtitle="Pick a topic to see every course in it."
                />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                    const total = category.subcategories.reduce((sum, sub) => sum + sub._count.courses, 0);

                    return (
                        <section
                            key={category.id}
                            id={category.id}
                            className="bg-card border border-border rounded-2xl p-6 scroll-mt-24"
                        >
                            <div className="flex items-baseline justify-between gap-2 mb-4">
                                <h2 className="text-lg font-semibold text-foreground">{category.name}</h2>
                                <span className="text-xs text-muted-foreground shrink-0">{courseCount(total)}</span>
                            </div>
                            <ul className="space-y-1">
                                {category.subcategories.map((sub) => (
                                    <li key={sub.id}>
                                        <Link
                                            href={`/category/${sub.id}`}
                                            className="flex items-center justify-between gap-2 px-3 py-2 -mx-3 rounded-lg text-sm hover:bg-accent group"
                                        >
                                            <span className={sub._count.courses > 0 ? "text-foreground" : "text-muted-foreground"}>
                                                {sub.name}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                {courseCount(sub._count.courses)}
                                                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </PageContainer>
    );
};

export default CategoriesPage;
