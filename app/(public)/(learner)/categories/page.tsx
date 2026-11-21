import Link from "next/link";
import Image from "next/image";

import { db } from "@/lib/db";
import { PageContainer } from "@/components/ui/page-container";
import { toneFor } from "@/lib/tones";
import { categoryArt } from "@/lib/category-art";
import { cn } from "@/lib/utils";

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
        <PageContainer className="py-8 md:py-12 min-h-[60vh]">
            <div className="mb-10 max-w-2xl space-y-3">
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2">Categories</p>
                <h1 className="text-display">Pick a lane. <span className="font-bold">Go deep.</span></h1>
                <p className="text-lg text-ink-2">Every category splits into focused sub-categories, so you land on the right course faster.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => {
                    const total = category.subcategories.reduce((sum, sub) => sum + sub._count.courses, 0);

                    return (
                        <section
                            key={category.id}
                            id={category.id}
                            aria-labelledby={`cat-${category.id}`}
                            className="flex flex-col gap-1.5 rounded-[28px] bg-white p-2.5 scroll-mt-24"
                        >
                            <div className={cn("relative isolate flex min-h-48 flex-col justify-between overflow-hidden rounded-[22px] p-5 text-ink", toneFor(index).bg)}>
                                <Image
                                    src={categoryArt(category.name, index)}
                                    alt=""
                                    width={1200}
                                    height={800}
                                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-4 bottom-0 -z-10 h-full w-auto max-w-none object-contain"
                                />
                                <div className="flex items-start justify-end">
                                    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-white px-3 text-[15px] font-medium">
                                        {total}
                                    </span>
                                </div>
                                <div className="max-w-[50%]">
                                    <h2 id={`cat-${category.id}`} className="text-2xl font-medium tracking-tight">{category.name}</h2>
                                    <p className="text-sm text-ink-2">{courseCount(total)}</p>
                                </div>
                            </div>
                            <ul className="flex flex-wrap gap-2 px-2 pt-3 pb-2.5">
                                {category.subcategories.map((sub) => (
                                    <li key={sub.id}>
                                        <Link
                                            href={`/category/${sub.id}`}
                                            className={cn(
                                                "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium shadow-[inset_0_0_0_1px_hsl(var(--border))] transition-colors hover:bg-ink hover:text-white hover:shadow-none",
                                                sub._count.courses > 0 ? "text-ink" : "text-muted-foreground"
                                            )}
                                        >
                                            {sub.name}
                                            <span className="text-xs opacity-70">{sub._count.courses}</span>
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
