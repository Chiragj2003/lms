"use client";

import { CourseCarousel } from "./carousel";
import { PageContainer } from "../ui/page-container";
import { SectionHeader } from "../ui/section-header";

export const BestSeller = () => {
    return (
        <PageContainer>
            <div className="mb-10">
                <SectionHeader 
                    title="Bestselling Courses"
                    subtitle="Accelerate growth — for you or your organization with our most popular courses."
                />
            </div>
            <CourseCarousel href="/api/public/bestseller" bestseller={true} />
        </PageContainer>
    )
}
