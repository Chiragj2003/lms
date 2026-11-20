"use client";

import { CourseCarousel } from "./carousel";
import { PageContainer } from "../ui/page-container";
import { SectionHeader } from "../ui/section-header";

export const BestSeller = () => {
    return (
        <PageContainer>
            <div className="mb-10">
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2 mb-2">Bestsellers</p>
                <SectionHeader
                    title="Popular right now"
                    subtitle="The courses learners are buying most this month."
                />
            </div>
            <CourseCarousel href="/api/public/bestseller" bestseller={true} />
        </PageContainer>
    )
}
